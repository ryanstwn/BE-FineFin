import roboAdvisorService from "../services/roboAdvisorService.js";

export const getRoboAdvisor = async (req, res) => {
  try {
    const userId = req.user.id; // Dari middleware auth
    const result = await roboAdvisorService.generateProjection(userId);

    return res.status(200).json({
      success: true,
      message: "Data proyeksi Robo-Advisor berhasil ditarik!",
      data: result,
    });
  } catch (error) {
    console.error("Error BE2 Robo Advisor:", error.message);
    
    if (error.message.includes("Validasi")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan pada server saat mengkalkulasi Robo-Advisor." 
    });
  }
};