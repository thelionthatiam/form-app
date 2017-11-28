

function applyDefaults(obj:any) {
  for(let k in obj) {
    if (k === 'dbname' && obj[k] === '') {
      console.log(obj[k], "in dbname")
      obj.dbname = 'formapp';
    } else if (k === 'username' && obj[k] === '') {
      console.log(obj[k], "in username")
      obj.username = 'formadmin';
    } else if (k === 'password' && obj[k] === '') {
      console.log(obj[k], "in formpassword")
      obj.password = 'formpassword'
    }
  }
  return obj;
}



export { applyDefaults };
