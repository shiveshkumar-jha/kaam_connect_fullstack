const normalize = (value) =>
    String(value || "")
        .trim()
        .toLowerCase();

const calculateSkillScore = (workerSkills, jobSkills) => {
    if (!jobSkills || jobSkills.length === 0) {
        return 100;
    }

    if (!workerSkills || workerSkills.length === 0) {
        return 0;
    }

    const workerSet = new Set(
        workerSkills.map(normalize)
    );

    let matched = 0;

    jobSkills.forEach((skill) => {
        if (workerSet.has(normalize(skill))) {
            matched++;
        }
    });

    return Math.round(
        (matched / jobSkills.length) * 100
    );
};

const calculateExperienceScore = (
    workerExperience,
    requiredExperience
) => {
    if (!requiredExperience) return 100;

    if (workerExperience >= requiredExperience) {
        return 100;
    }

    return Math.max(
        0,
        Math.round(
            (workerExperience / requiredExperience) * 100
        )
    );
};

const calculateLocationScore = (
    workerLocation,
    jobLocation
) => {
    if (!workerLocation?.city || !jobLocation?.city) {
        return 50;
    }

    return normalize(workerLocation.city) ===
        normalize(jobLocation.city)
        ? 100
        : 40;
};

const calculateSalaryScore = (
    expectedSalary,
    salaryMin,
    salaryMax
) => {
    if (!expectedSalary) return 70;

    if (
        expectedSalary >= salaryMin &&
        expectedSalary <= salaryMax
    ) {
        return 100;
    }

    if (expectedSalary < salaryMin) {
        return 90;
    }

    return 40;
};

const calculateMatchScore = (worker, job) => {
    const skillScore = calculateSkillScore(
        worker.skills,
        job.skills
    );

    const experienceScore = calculateExperienceScore(
        worker.experience,
        job.experienceRequired
    );

    const locationScore = calculateLocationScore(
        worker.location,
        job.location
    );

    const salaryScore = calculateSalaryScore(
        worker.expectedSalary,
        job.salaryMin,
        job.salaryMax
    );

    const certificationScore =
        worker.certificationCount > 0 ? 100 : 50;

    const finalScore = Math.round(
        skillScore * 0.40 +
        experienceScore * 0.20 +
        locationScore * 0.15 +
        salaryScore * 0.10 +
        certificationScore * 0.05 +
        10
    );

    return {
        score: Math.min(finalScore, 100),

        breakdown: {
            skills: skillScore,
            experience: experienceScore,
            location: locationScore,
            salary: salaryScore,
            certifications: certificationScore
        }
    };
};

export {
    calculateMatchScore
};