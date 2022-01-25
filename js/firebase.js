var userOn=false;
var resp
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

var firebase=firebase.initializeApp(config);
var auth=firebase.auth()
//var db=firebase.database().ref("registros")
var db=firebase.database().ref()

//escutando status do firebase
auth.onAuthStateChanged(function(user) {
  if (user) {
    //online
    let lbl_user=document.getElementById("user")
    lbl_user.innerHTML=user.email
    resp=user.email
    userOn=true
  } else {
    userOn=false
    resp=""
  }
});


//Ação de Login do botão #login
function logar() { 
  const email=document.getElementById('edt_email').value
  const pass=document.getElementById('edt_senha').value

  if(email=="" || pass==""){
    alert("Preencha todos os campos para continuar")
    document.getElementById('edt_email').focus()
    return
  }

	auth.signInWithEmailAndPassword(email, pass).then(function(){
    window.location.href='pages/home.html'
  }).catch(function(error) {   
   alert(error);  
  });
};

function sair(){
   auth.signOut()
  .then(function() {
    window.location.href="https://cleitoncomfe.github.io/Controle-PF-Correios/index.html"
  }, function(error) {
    document.getElementById("console").innerHTML = JSON.stringify( error );
  });

}

//Implementa o cadastro da retenção da mercadoria - pages=registrar.html
function cadastrar(){
  if(userOn){
    try{
      let cod=document.getElementById('edt_cod').value
      cod=cod.toLowerCase()
      let nf= document.getElementById('edt_nf').value
      let tr= document.getElementById('edt_tr').value
      let rs= document.getElementById('edt_rs').value
      let loc=document.getElementById("edt_loc").value

      if(cod=="" || nf=="" || tr=="" || rs=="" || loc==""){
        alert("Preencha todos os campos")
        return
      }

      data=(new Date()).getTime()
      
      let dados = {
        data_cadastro:data,
        data_liberacao:"",
        num_nf:nf,
        num_tr:tr,
        r_social:rs,
        localizacao:loc,
        resp_entrada:resp,
        resp_saida:"",
        status:true
      } 

      db.child("registros").child(cod).set(dados).then(function(){
        document.getElementById('edt_cod').value=""
        document.getElementById('edt_nf').value=""
        document.getElementById('edt_tr').value=""
        document.getElementById('edt_rs').value=""
        document.getElementById('edt_loc').value=""
        alert('Cadastro realizado com sucesso')
      }).catch(function(erro){
        'Ocorreu um erro: Cadastre novamente mais tarde'+erro
      })

    }catch(erro){
      alert('Ocorreu um erro: Cadastre novamente mais tarde'+erro)
    }

  }else{
    alert("Você não está logado: acesso negado")
  }
    
}

//Implementa as consultas e exibe o resultado na página consultar.html
function consultar(){
  let msg_erro="Ocorreu um erro. Verifique se o código está correto e tente novamente"
  if(userOn){
      try{
      let resultado=document.getElementById('result')
      let data=document.getElementById("data")
      let nf=document.getElementById("nf");
      let tr=document.getElementById("tr");
      let rs=document.getElementById("rs")
      let status=document.getElementById("status")
      let dt_l=document.getElementById('data_liberacao')
      let resp_entrada=document.getElementById("resp_entrada")
      let resp_saida=document.getElementById("resp_saida")
      let localizacao=document.getElementById("loc")

      let cod=document.getElementById('edt_consultar_cod').value
      if(cod==""){
        alert("Digite o código para continuar")
        document.getElementById('edt_consultar_cod').focus()
        return
      }
      
      db.child("registros").child(cod.toLowerCase()).once('value').then(function(snap){
        result=snap.val();
        data_entrada=new Date(result.data_cadastro).toLocaleString()
        if(result.data_liberacao==""){
          data_saida=result.data_liberacao
        }else{
          data_saida=new Date(result.data_liberacao).toLocaleString()
        }
        
        resultado.innerHTML="Resultado da consulta:"
        data.innerHTML="Data da retenção: "+data_entrada;
        nf.innerHTML="Número da nota fiscal: "+ result.num_nf;
        tr.innerHTML="Número do TRDCD: "+result.num_tr;
        rs.innerHTML="Razão Social: "+result.r_social;
        dt_l.innerHTML="Data da liberação: "+data_saida;
        resp_entrada.innerHTML="Responsável pelo cadastro: "+result.resp_entrada;
        resp_saida.innerHTML="Responsável pela saida: "+result.resp_saida;
        localizacao.innerHTML="Localização do pacote: Estante: "+result.localizacao;

        if(result.status==true){
          status.innerHTML="Status da mercadoria: Retida"
        }else{
          status.innerHTML="Status da mercadoria: Liberada"
        }
        document.getElementById('edt_consultar_cod').value=""
        document.getElementById("btnPrint").style.visibility="visible"
        document.getElementById("btnPrint").style.display="block"
      }).catch(function(erro){
        alert(msg_erro+erro)
      })
      
    }catch(erro){
      alert(msg_erro + erro)
    }
  }else{
    alert("Você não está logado: acesso negado")
  }
  
}

function imprimirConsulta(){
  document.getElementById("btnPrint").style.display="none"
  window.print()
}

//Modifica o status de retenção da mercadoria (retida=true/liberada=false) - pages=liberar.html
function liberar(){
  let msg_erro="Ocorreu um erro:Não foi possível liberar a mercadoria. Verifique se o código está correto e tente novamente. Erro: "
  let cod=document.getElementById("edt_liberar_cod").value
  if(cod==""){
    alert("Digite o código para continuar")
    document.getElementById("edt_liberar_cod").focus()
    return
  }
  let verificaStatus=null 
  let data_liberacao=""
  let data=(new Date()).getTime()
  
  if(userOn){
    db.child("registros").child(cod.toLowerCase()).once('value').then( function(snap){
      verificaStatus=snap.val().status;
  
      if(verificaStatus){
        dados={status:false,data_liberacao:data, resp_saida:resp}
        let text="Deseja realmente liberar a mercadoria?,"
        if (confirm(text) == true) {
          db.child("registros").child(cod.toLowerCase()).update(dados).then(function(){
            alert("Mercadoria liberada com sucesso");
            document.getElementById("edt_liberar_cod").value=""
          }).catch(function(erro){
            alert(msg_erro + erro)
          })
        } else {
          alert("Liberação cancelada")
        }
      }else{
        alert("Essa mercadoria já está liberda. Var em consultar para ver os detalhes da liberação.")
    } 
    
    }).catch(function(erro){
      alert(msg_erro + erro)
    })
  } else{
    alert("Você não está logado: acesso negado")
  }
   
}

function gerarRelatorio(){
  
  const select = document.getElementById('tipo_relatorio');
	const option = select.options[select.selectedIndex].value;
  let data_in=document.getElementById("date_init").value
  let data_fim=document.getElementById("date_fim").value
  if(data_in==""){
    alert("Selecione a data para continuar")
    return
  }
  //Adequa a data para o formato armazenado no Firebase
  data_in=(new Date(data_in)).getTime()
  
  if(data_fim==""){
    data_fim=data_in+86400000
  }else{
    data_fim=(new Date(data_fim)).getTime()+86400000
  }  

  //Seleciona a tabela para exibição do relatório na págian relatório
  const tabela=document.getElementById("tabela")
  
  //Realiza as query no banco de dados Firebase e exibe o relatório
  if(option=="entrada"){
    db.child("registros").orderByChild('data_cadastro').startAt(data_in).endAt(data_fim).on('value', (snapshot) => {
      tabela.innerHTML=""
      snapshot.forEach((data) => {
        if(data.val().status){
          preencherTabela(tabela,0,data)
        }
      });
    });
  }else if(option=="saida"){
    db.child("registros").orderByChild('data_cadastro').startAt(data_in).endAt(data_fim).on('value', (snapshot) => {
      tabela.innerHTML=""
      snapshot.forEach((data) => {
        if(!data.val().status){
          preencherTabela(tabela,0,data)
        }
      });
    });
  }else{
    db.child("registros").orderByChild('data_cadastro').startAt(data_in).endAt(data_fim).on('value',     (snapshot) => {
      tabela.innerHTML=""
      snapshot.forEach((data) => {
        preencherTabela(tabela,0,data)
      });
    });
  } 
  
}

//Função que preenche a tabela com os dados vindo do banco de dados irebase
function preencherTabela(tabela,i,data) {
  let newRow = tabela.insertRow(i)
  let cell0=newRow.insertCell(0)
  cell0.innerHTML=data.key
  let cell1=newRow.insertCell(1)
  cell1.innerHTML=data.val().num_nf
  let cell2=newRow.insertCell(2)
  cell2.innerHTML=data.val().num_tr
  let cell3=newRow.insertCell(3)
  cell3.innerHTML=data.val().r_social
  let cell4=newRow.insertCell(4)
  cell4.innerHTML=(new Date(data.val().data_cadastro)).toLocaleString()
  let cell5=newRow.insertCell(5)
  if(data.val().data_liberacao==""){
    cell5.innerHTML=""
  }else{
    cell5.innerHTML=(new Date(data.val().data_liberacao)).toLocaleString()
  }
  let cel6=newRow.insertCell(6)
  cel6.innerHTML=data.val().localizacao
  i++
}

//Criptografia

function encrypt(message = '', key = ''){
    var message = CryptoJS.AES.encrypt(message, key);
    return message.toString();
}
function decrypt(message = '', key = ''){
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
}








