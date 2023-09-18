export function dateYYYYMonDD(date) {
  let datearray = date.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let newdate = datearray[2] + " " + monthNames[parseInt(datearray[1]) - 1] + " " + datearray[0];

  return newdate;
}
