let ref;
fetch("/assets/ref.json")
  .then(res => res.json())
  .then(data => {
    ref = data;
  })
  .catch(console.error);

function search(str, limit = 30) {
  str = str.replace(/ى/g,"ي");
  if (ref) {
    // return ref.filter(obj => obj.text.includes(str)).slice(0, limit);
    return ref.filter(obj => obj.text.includes(str));
  }
}
