document.addEventListener('deviceready', onDeviceReady, false);

var indicePizzaEmEdicao = null; 
var listaPizzasCadastradas = [];
var PIZZARIA_ID = "pizzaria-do-dedelas";

var applista = document.getElementById('applista');
var appcadastro = document.getElementById('appcadastro');
var btnNovo = document.getElementById('btnNovo');
var btnCancelar = document.getElementById('btnCancelar');
var btnSalvar = document.getElementById('btnSalvar');
var btnExcluir = document.getElementById('btnExcluir');
var btnFoto = document.getElementById('btnFoto');
var imagem = document.getElementById('imagem');

function onDeviceReady() {
    cordova.plugin.http.setDataSerializer('json');
    carregarPizzas();
}

btnNovo.addEventListener('click', onNovoClick, false);
btnCancelar.addEventListener('click', onCancelarClick, false);
btnSalvar.addEventListener('click', onSalvarClick, false);
btnExcluir.addEventListener('click', onExcluirClick, false);
btnFoto.addEventListener('click', onFotoClick, false);

function onNovoClick() {
    document.getElementById('pizza').value = "";
    document.getElementById('preco').value = "";
    imagem.style.backgroundImage = "none";
    indicePizzaEmEdicao = null;
    applista.style.display = 'none';
    appcadastro.style.display = 'flex';
}

function onCancelarClick() {
    applista.style.display = 'flex';
    appcadastro.style.display = 'none';
}

function onSalvarClick() {
    var pizzaInput = document.getElementById('pizza');
    var precoInput = document.getElementById('preco');
    var pizzaValor = pizzaInput.value.trim();
    var precoValor = precoInput.value.trim();
    
    var bg = imagem.style.backgroundImage;
    var regex = /url\(["']?(data:image\/jpeg;base64,.*)["']?\)/;
    var match = regex.exec(bg);
    var imagemValor = "";
    if (match && match[1]) {
        imagemValor = match[1].substring("data:image/jpeg;base64,".length);
    }
    
    if (pizzaValor === "" || precoValor === "" || imagemValor === "") {
        alert("Por favor, preencha todos os campos e capture uma foto!");
        return;
    }
    
    var dados = {
        pizzaria: PIZZARIA_ID,
        pizza: pizzaValor,
        preco: parseFloat(precoValor),
        imagem: imagemValor
    };
    
    var url, metodo;
    if (indicePizzaEmEdicao === null) {
        url = "https://pedidos-pizzaria.glitch.me/admin/pizza/";
        metodo = 'post';
    } else {
        dados.pizzaid = listaPizzasCadastradas[indicePizzaEmEdicao]._id;
        url = "https://pedidos-pizzaria.glitch.me/admin/pizza/";
        metodo = 'put';
    }
    
    cordova.plugin.http[metodo](url, dados, { "Content-Type": "application/json" },
        function(response) {
            alert("Pizza salva com sucesso!");
            carregarPizzas();
            applista.style.display = 'flex';
            appcadastro.style.display = 'none';
        },
        function(error) {
            console.error("Erro ao salvar pizza:", error);
            alert("Erro ao salvar pizza. Tente novamente.");
        }
    );
}

function onExcluirClick() {
    if (indicePizzaEmEdicao === null) {
        alert("Nenhuma pizza selecionada para excluir!");
        return;
    }
    
    var nomePizza = listaPizzasCadastradas[indicePizzaEmEdicao].pizza;
    var url = "https://pedidos-pizzaria.glitch.me/admin/pizza/" + PIZZARIA_ID + "/" + encodeURIComponent(nomePizza);
    
    cordova.plugin.http.delete(url, {}, {},
        function(response) {
            alert("Pizza excluída com sucesso!");
            carregarPizzas();
            applista.style.display = 'flex';
            appcadastro.style.display = 'none';
            indicePizzaEmEdicao = null;
            imagem.style.backgroundImage = "none";
        },
        function(error) {
            console.error("Erro ao excluir pizza:", error);
            alert("Erro ao excluir pizza.");
        }
    );
}

function onFotoClick() {
    navigator.camera.getPicture(onFotoSuccess, onFotoFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true
    });
}

function onFotoSuccess(imageData) {
    imagem.style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')";
}

function onFotoFail(message) {
    alert("Falha ao capturar a foto: " + message);
}

function carregarPizzas() {
    var listaPizzasDiv = document.getElementById('listaPizzas');
    listaPizzasDiv.innerHTML = "";
    
    var url = "https://pedidos-pizzaria.glitch.me/admin/pizzas/" + PIZZARIA_ID;
    cordova.plugin.http.get(url, {}, {},
        function(response) {
            if (response.data !== "") {
                listaPizzasCadastradas = JSON.parse(response.data);
                for (var idx = 0; idx < listaPizzasCadastradas.length; idx++) {
                    var item = listaPizzasCadastradas[idx];
                    var novo = document.createElement('div');
                    novo.classList.add('linha');
                    novo.innerHTML = `${item.pizza} - R$ ${parseFloat(item.preco).toFixed(2)}`;
                    novo.id = idx;
                    novo.addEventListener('click', function() {
                        selecionarPizza(this.id);
                    }, false);
                    listaPizzasDiv.appendChild(novo);
                }
            }
        },
        function(error) {
            console.error("Erro ao carregar pizzas:", error);
            alert("Erro ao carregar pizzas. Verifique sua conexão com a internet.");
        }
    );
}

function selecionarPizza(id) {
    var pizzaData = listaPizzasCadastradas[id];
    if (pizzaData) {
        document.getElementById('pizza').value = pizzaData.pizza;
        document.getElementById('preco').value = pizzaData.preco;
        if (pizzaData.imagem) {
            document.getElementById('imagem').style.backgroundImage = "url('data:image/jpeg;base64," + pizzaData.imagem + "')";
        } else {
            document.getElementById('imagem').style.backgroundImage = "none";
        }
        indicePizzaEmEdicao = id;
        applista.style.display = 'none';
        appcadastro.style.display = 'flex';
    }
}
