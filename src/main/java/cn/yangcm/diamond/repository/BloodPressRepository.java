package cn.yangcm.diamond.repository;

import cn.yangcm.diamond.domain.BloodPress;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the BloodPress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BloodPressRepository extends JpaRepository<BloodPress, Long> {

    @Query("select blood_press from BloodPress blood_press where blood_press.user.login = ?#{principal.username}")
    List<BloodPress> findByUserIsCurrentUser();

}
