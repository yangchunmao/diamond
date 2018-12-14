package cn.yangcm.diamond.web.rest;

import com.codahale.metrics.annotation.Timed;
import cn.yangcm.diamond.domain.BloodPress;
import cn.yangcm.diamond.repository.BloodPressRepository;
import cn.yangcm.diamond.repository.search.BloodPressSearchRepository;
import cn.yangcm.diamond.web.rest.errors.BadRequestAlertException;
import cn.yangcm.diamond.web.rest.util.HeaderUtil;
import cn.yangcm.diamond.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing BloodPress.
 */
@RestController
@RequestMapping("/api")
public class BloodPressResource {

    private final Logger log = LoggerFactory.getLogger(BloodPressResource.class);

    private static final String ENTITY_NAME = "bloodPress";

    private final BloodPressRepository bloodPressRepository;

    private final BloodPressSearchRepository bloodPressSearchRepository;

    public BloodPressResource(BloodPressRepository bloodPressRepository, BloodPressSearchRepository bloodPressSearchRepository) {
        this.bloodPressRepository = bloodPressRepository;
        this.bloodPressSearchRepository = bloodPressSearchRepository;
    }

    /**
     * POST  /blood-presses : Create a new bloodPress.
     *
     * @param bloodPress the bloodPress to create
     * @return the ResponseEntity with status 201 (Created) and with body the new bloodPress, or with status 400 (Bad Request) if the bloodPress has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/blood-presses")
    @Timed
    public ResponseEntity<BloodPress> createBloodPress(@Valid @RequestBody BloodPress bloodPress) throws URISyntaxException {
        log.debug("REST request to save BloodPress : {}", bloodPress);
        if (bloodPress.getId() != null) {
            throw new BadRequestAlertException("A new bloodPress cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BloodPress result = bloodPressRepository.save(bloodPress);
        bloodPressSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/blood-presses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blood-presses : Updates an existing bloodPress.
     *
     * @param bloodPress the bloodPress to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated bloodPress,
     * or with status 400 (Bad Request) if the bloodPress is not valid,
     * or with status 500 (Internal Server Error) if the bloodPress couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/blood-presses")
    @Timed
    public ResponseEntity<BloodPress> updateBloodPress(@Valid @RequestBody BloodPress bloodPress) throws URISyntaxException {
        log.debug("REST request to update BloodPress : {}", bloodPress);
        if (bloodPress.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BloodPress result = bloodPressRepository.save(bloodPress);
        bloodPressSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, bloodPress.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blood-presses : get all the bloodPresses.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of bloodPresses in body
     */
    @GetMapping("/blood-presses")
    @Timed
    public ResponseEntity<List<BloodPress>> getAllBloodPresses(Pageable pageable) {
        log.debug("REST request to get a page of BloodPresses");
        Page<BloodPress> page = bloodPressRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/blood-presses");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /blood-presses/:id : get the "id" bloodPress.
     *
     * @param id the id of the bloodPress to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the bloodPress, or with status 404 (Not Found)
     */
    @GetMapping("/blood-presses/{id}")
    @Timed
    public ResponseEntity<BloodPress> getBloodPress(@PathVariable Long id) {
        log.debug("REST request to get BloodPress : {}", id);
        Optional<BloodPress> bloodPress = bloodPressRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bloodPress);
    }

    /**
     * DELETE  /blood-presses/:id : delete the "id" bloodPress.
     *
     * @param id the id of the bloodPress to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blood-presses/{id}")
    @Timed
    public ResponseEntity<Void> deleteBloodPress(@PathVariable Long id) {
        log.debug("REST request to delete BloodPress : {}", id);

        bloodPressRepository.deleteById(id);
        bloodPressSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/blood-presses?query=:query : search for the bloodPress corresponding
     * to the query.
     *
     * @param query the query of the bloodPress search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/blood-presses")
    @Timed
    public ResponseEntity<List<BloodPress>> searchBloodPresses(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BloodPresses for query {}", query);
        Page<BloodPress> page = bloodPressSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/blood-presses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
