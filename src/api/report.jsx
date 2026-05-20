// api/report.js

export async function makereport(info) {
  const token = localStorage.getItem("authToken");

  try {
    const res = await fetch("http://localhost:5000/nutrlink/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reporterId: info.reporterId,
        reporterModel: info.reporterModel,       // passed from Report.jsx as "Customer"
        reportedUserId: info.reportedUserId,
        reportedUserModel: info.reportedUserModel, // passed as "Nutritionist"
        reason: info.reason,
        description: info.description,           // fixed: was info.descriptio / indo.descriptio
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit report");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get all reports (admin only)
export async function getreport() {
  const token = localStorage.getItem("authToken");

  try {
    const res = await fetch("http://localhost:5000/nutrlink/api/reports", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch reports");
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}