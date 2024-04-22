import moment from "moment"

export function getBirthday(birthday: string) {
  return moment(birthday).format("MMMM Do, YYYY").replace(", 0004", "")
}
