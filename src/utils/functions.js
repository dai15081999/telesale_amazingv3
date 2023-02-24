export const formartDate = (date, options) => {
  const d = new Date(date);
  const f = new Intl.DateTimeFormat("vi", {
    dateStyle: options,
  });
  return f.format(d);
};

export function toHoursAndMinutes(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
}
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export const truncate = (text, startChars, endChars, maxLength) => {
  if (text?.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};

export function formatNumber(number) {
  let result =
    number.substr(0, 4) + "." + number.substr(4, 3) + "." + number.substr(7, 3);
  return result;
}

export function userNamegroup(names) {
  const result = new Map();

  names.forEach((elm) => {
    if (elm.lastName) {
      result.set(elm.lastName.substr(0, 1).toUpperCase(), []);
    } else {
      result.set(elm.lastName, []);
    }
  });
  names.forEach((elm) => {
    if (elm.lastName) {
      result.forEach((value, key) => {
        if (key === elm.lastName.substr(0, 1).toUpperCase()) {
          result.set(key, [...value, elm]);
        }
      });
    } else {
      result.forEach((value, key) => {
        if (key === elm.lastName) {
          result.set(key, [...value, elm]);
        }
      });
    }
  });

  return result;
}

export function formatMoney(total) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(total);
}
