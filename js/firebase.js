var config = {
  apiKey: "AIzaSyAihVLgAVXP2iBoDQ0mJMZrIUgSZwnlGjE",
  authDomain: "appcorreios-a7e6e.firebaseapp.com",
  databaseURL: "https://appcorreios-a7e6e.firebaseio.com",
  projectId: "appcorreios-a7e6e",
  storageBucket: "appcorreios-a7e6e.appspot.com",
  messagingSenderId: "889544024361",
  appId: "1:889544024361:web:42a4be417523e6face1738",
  measurementId: "G-BE8N067S8X"
};

firebase.initializeApp(config);
auth=firebase.auth()
db=firebase.database().ref()

//escutando status do firebase
auth.onAuthStateChanged(function(user) {
  if (user) {
    //online
    console.log('ok'),
    console.log(user);
  } else {
    console.log('offline')
  }
});


//Ação de Login do botão #login
function logar() { 
  let email=document.getElementById('edt_email')
  let pass=document.getElementById('edt_senha')
  
  window.location.href='pages/home.html'
  
	/*auth.signInWithEmailAndPassword(email.value, pass.value).then(function(){
    window.location.href='registrar.html'
  }).catch(function(error) { 
  
  console.log(error);
  
  });*/
};




//Ação de Login do botão #logout
/*
document.getElementById("logout").onclick = function() { 

  auth.signOut()
  .then(function() {
    document.getElementById("console").innerHTML = 'Logout';
  }, function(error) {
    document.getElementById("console").innerHTML = JSON.stringify( error );
  });

};

//Ação de alterar senha do botão #update
document.getElementById("update").onclick = function() { 

auth.currentUser.updatePassword('123mudar')
.then(function() {
	document.getElementById("console").innerHTML = 'Senha Alterada!';
})
.catch(function(error) {
	document.getElementById("console").innerHTML = JSON.stringify( error );
}); 


};

//Ação de criar do botão #create
document.getElementById("create").onclick = function() { 


auth.createUserWithEmailAndPassword('email@email.com.br', "123mudar").catch(function(error) {
  document.getElementById("console").innerHTML = JSON.stringify( error );
});

 
};

//Ação de excluir do botão #delete
document.getElementById("delete").onclick = function() { 


var user = auth.currentUser;
user.delete().then(function() {
  // User deleted.
}).catch(function(error) {
  document.getElementById("console").innerHTML = JSON.stringify( error );
});


 
};

*/

function cadastrar(){
  let cod=document.getElementById('edt_cod').value
  let nf= document.getElementById('edt_nf').value
  let tr= document.getElementById('edt_tr').value
  let rs= document.getElementById('edt_rs').value

  let dados = {
    num_nf:nf,
    num_tr:tr,
    r_social:rs
  }

  try{
    db.child(cod).set(dados)
    db.child(cod).on('value',function(snap){
      if(snap.val()){
        alert('Cadastro realizado com sucesso')
      }
    })   
  }catch(error){
    alert('Ocorreu um erro: Cadastre novamente')
    console.log(error)
  }
  
}
