export default (date1, date2) => {
  // Calculate de difference between two dates (format: Days)
  
  let Difference_In_Time = date2.getTime() - date1.getTime(); 
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return Difference_In_Days
}