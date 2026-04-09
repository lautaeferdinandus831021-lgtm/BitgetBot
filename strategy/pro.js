function analyze(state){

  const m1 = state.m1Closes;
  const m5 = state.m5Closes;

  if(m1.length < 2 || m5.length < 2) return null;

  const m1Trend =
    m1[m1.length - 1] > m1[m1.length - 2] ? "UP" : "DOWN";

  const m5Trend =
    m5[m5.length - 1] > m5[m5.length - 2] ? "UP" : "DOWN";

  console.log("M1:", m1Trend, "| M5:", m5Trend);

  // ===== FILTER =====
  if(m1Trend === "UP" && m5Trend === "UP"){
    return { type: "long" };
  }

  if(m1Trend === "DOWN" && m5Trend === "DOWN"){
    return { type: "short" };
  }

  return null;
}

module.exports = { analyze };
