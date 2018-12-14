package cn.yangcm.diamond.repository.search;

import cn.yangcm.diamond.domain.BloodPress;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the BloodPress entity.
 */
public interface BloodPressSearchRepository extends ElasticsearchRepository<BloodPress, Long> {
}
