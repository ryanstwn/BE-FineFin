// src/repositories/onboardingRepository.js
import FinancialProfile from "../models/financialProfile.js";

const createOnboarding = async (onboardingData) => {
    // onboardingData ini berisi semua data dari service (termasuk riskScore & riskCategory)
    const newProfile = new FinancialProfile(onboardingData);
    return await newProfile.save();
};

export default {
    createOnboarding
};