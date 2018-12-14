package cn.yangcm.diamond.web.rest;

import cn.yangcm.diamond.DiamondApp;

import cn.yangcm.diamond.domain.BloodPress;
import cn.yangcm.diamond.repository.BloodPressRepository;
import cn.yangcm.diamond.repository.search.BloodPressSearchRepository;
import cn.yangcm.diamond.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static cn.yangcm.diamond.web.rest.TestUtil.sameInstant;
import static cn.yangcm.diamond.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BloodPressResource REST controller.
 *
 * @see BloodPressResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DiamondApp.class)
public class BloodPressResourceIntTest {

    private static final ZonedDateTime DEFAULT_TIMESTAMP = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIMESTAMP = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_SYSTOLIC = 1;
    private static final Integer UPDATED_SYSTOLIC = 2;

    private static final Integer DEFAULT_DIASTOLIC = 1;
    private static final Integer UPDATED_DIASTOLIC = 2;

    @Autowired
    private BloodPressRepository bloodPressRepository;

    /**
     * This repository is mocked in the cn.yangcm.diamond.repository.search test package.
     *
     * @see cn.yangcm.diamond.repository.search.BloodPressSearchRepositoryMockConfiguration
     */
    @Autowired
    private BloodPressSearchRepository mockBloodPressSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBloodPressMockMvc;

    private BloodPress bloodPress;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BloodPressResource bloodPressResource = new BloodPressResource(bloodPressRepository, mockBloodPressSearchRepository);
        this.restBloodPressMockMvc = MockMvcBuilders.standaloneSetup(bloodPressResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BloodPress createEntity(EntityManager em) {
        BloodPress bloodPress = new BloodPress()
            .timestamp(DEFAULT_TIMESTAMP)
            .systolic(DEFAULT_SYSTOLIC)
            .diastolic(DEFAULT_DIASTOLIC);
        return bloodPress;
    }

    @Before
    public void initTest() {
        bloodPress = createEntity(em);
    }

    @Test
    @Transactional
    public void createBloodPress() throws Exception {
        int databaseSizeBeforeCreate = bloodPressRepository.findAll().size();

        // Create the BloodPress
        restBloodPressMockMvc.perform(post("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPress)))
            .andExpect(status().isCreated());

        // Validate the BloodPress in the database
        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeCreate + 1);
        BloodPress testBloodPress = bloodPressList.get(bloodPressList.size() - 1);
        assertThat(testBloodPress.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testBloodPress.getSystolic()).isEqualTo(DEFAULT_SYSTOLIC);
        assertThat(testBloodPress.getDiastolic()).isEqualTo(DEFAULT_DIASTOLIC);

        // Validate the BloodPress in Elasticsearch
        verify(mockBloodPressSearchRepository, times(1)).save(testBloodPress);
    }

    @Test
    @Transactional
    public void createBloodPressWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bloodPressRepository.findAll().size();

        // Create the BloodPress with an existing ID
        bloodPress.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBloodPressMockMvc.perform(post("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPress)))
            .andExpect(status().isBadRequest());

        // Validate the BloodPress in the database
        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeCreate);

        // Validate the BloodPress in Elasticsearch
        verify(mockBloodPressSearchRepository, times(0)).save(bloodPress);
    }

    @Test
    @Transactional
    public void checkTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressRepository.findAll().size();
        // set the field null
        bloodPress.setTimestamp(null);

        // Create the BloodPress, which fails.

        restBloodPressMockMvc.perform(post("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPress)))
            .andExpect(status().isBadRequest());

        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSystolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressRepository.findAll().size();
        // set the field null
        bloodPress.setSystolic(null);

        // Create the BloodPress, which fails.

        restBloodPressMockMvc.perform(post("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPress)))
            .andExpect(status().isBadRequest());

        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDiastolicIsRequired() throws Exception {
        int databaseSizeBeforeTest = bloodPressRepository.findAll().size();
        // set the field null
        bloodPress.setDiastolic(null);

        // Create the BloodPress, which fails.

        restBloodPressMockMvc.perform(post("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPress)))
            .andExpect(status().isBadRequest());

        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBloodPresses() throws Exception {
        // Initialize the database
        bloodPressRepository.saveAndFlush(bloodPress);

        // Get all the bloodPressList
        restBloodPressMockMvc.perform(get("/api/blood-presses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPress.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }
    
    @Test
    @Transactional
    public void getBloodPress() throws Exception {
        // Initialize the database
        bloodPressRepository.saveAndFlush(bloodPress);

        // Get the bloodPress
        restBloodPressMockMvc.perform(get("/api/blood-presses/{id}", bloodPress.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(bloodPress.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(sameInstant(DEFAULT_TIMESTAMP)))
            .andExpect(jsonPath("$.systolic").value(DEFAULT_SYSTOLIC))
            .andExpect(jsonPath("$.diastolic").value(DEFAULT_DIASTOLIC));
    }

    @Test
    @Transactional
    public void getNonExistingBloodPress() throws Exception {
        // Get the bloodPress
        restBloodPressMockMvc.perform(get("/api/blood-presses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBloodPress() throws Exception {
        // Initialize the database
        bloodPressRepository.saveAndFlush(bloodPress);

        int databaseSizeBeforeUpdate = bloodPressRepository.findAll().size();

        // Update the bloodPress
        BloodPress updatedBloodPress = bloodPressRepository.findById(bloodPress.getId()).get();
        // Disconnect from session so that the updates on updatedBloodPress are not directly saved in db
        em.detach(updatedBloodPress);
        updatedBloodPress
            .timestamp(UPDATED_TIMESTAMP)
            .systolic(UPDATED_SYSTOLIC)
            .diastolic(UPDATED_DIASTOLIC);

        restBloodPressMockMvc.perform(put("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBloodPress)))
            .andExpect(status().isOk());

        // Validate the BloodPress in the database
        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeUpdate);
        BloodPress testBloodPress = bloodPressList.get(bloodPressList.size() - 1);
        assertThat(testBloodPress.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testBloodPress.getSystolic()).isEqualTo(UPDATED_SYSTOLIC);
        assertThat(testBloodPress.getDiastolic()).isEqualTo(UPDATED_DIASTOLIC);

        // Validate the BloodPress in Elasticsearch
        verify(mockBloodPressSearchRepository, times(1)).save(testBloodPress);
    }

    @Test
    @Transactional
    public void updateNonExistingBloodPress() throws Exception {
        int databaseSizeBeforeUpdate = bloodPressRepository.findAll().size();

        // Create the BloodPress

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBloodPressMockMvc.perform(put("/api/blood-presses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(bloodPress)))
            .andExpect(status().isBadRequest());

        // Validate the BloodPress in the database
        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeUpdate);

        // Validate the BloodPress in Elasticsearch
        verify(mockBloodPressSearchRepository, times(0)).save(bloodPress);
    }

    @Test
    @Transactional
    public void deleteBloodPress() throws Exception {
        // Initialize the database
        bloodPressRepository.saveAndFlush(bloodPress);

        int databaseSizeBeforeDelete = bloodPressRepository.findAll().size();

        // Get the bloodPress
        restBloodPressMockMvc.perform(delete("/api/blood-presses/{id}", bloodPress.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<BloodPress> bloodPressList = bloodPressRepository.findAll();
        assertThat(bloodPressList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the BloodPress in Elasticsearch
        verify(mockBloodPressSearchRepository, times(1)).deleteById(bloodPress.getId());
    }

    @Test
    @Transactional
    public void searchBloodPress() throws Exception {
        // Initialize the database
        bloodPressRepository.saveAndFlush(bloodPress);
        when(mockBloodPressSearchRepository.search(queryStringQuery("id:" + bloodPress.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(bloodPress), PageRequest.of(0, 1), 1));
        // Search the bloodPress
        restBloodPressMockMvc.perform(get("/api/_search/blood-presses?query=id:" + bloodPress.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bloodPress.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(sameInstant(DEFAULT_TIMESTAMP))))
            .andExpect(jsonPath("$.[*].systolic").value(hasItem(DEFAULT_SYSTOLIC)))
            .andExpect(jsonPath("$.[*].diastolic").value(hasItem(DEFAULT_DIASTOLIC)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BloodPress.class);
        BloodPress bloodPress1 = new BloodPress();
        bloodPress1.setId(1L);
        BloodPress bloodPress2 = new BloodPress();
        bloodPress2.setId(bloodPress1.getId());
        assertThat(bloodPress1).isEqualTo(bloodPress2);
        bloodPress2.setId(2L);
        assertThat(bloodPress1).isNotEqualTo(bloodPress2);
        bloodPress1.setId(null);
        assertThat(bloodPress1).isNotEqualTo(bloodPress2);
    }
}
