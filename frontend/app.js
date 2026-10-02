document.getElementById("login").addEventListener("submit",async e=>{
e.preventDefault();
const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.value,password:password.value})});
const d=await r.json(); document.getElementById("msg").textContent=d.message;
if(r.ok) sessionStorage.setItem("token",d.token);
});
