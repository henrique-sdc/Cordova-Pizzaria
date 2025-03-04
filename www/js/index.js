document.addEventListener('deviceready', onDeviceReady, false);

var indicePizzaEdicao = null;
var listaPizzasCadastradas = [];
var PIZZARIA_ID = "pizzaria-do-dedelas";

var applista, appcadastro, btnNovo, btnCancelar, btnSalvar, btnExcluir, btnFoto, imagem;

function onDeviceReady() {
    applista = document.getElementById('applista');
    appcadastro = document.getElementById('appcadastro');
    btnNovo = document.getElementById('btnNovo');
    btnCancelar = document.getElementById('btnCancelar');
    btnSalvar = document.getElementById('btnSalvar');
    btnExcluir = document.getElementById('btnExcluir');
    btnFoto = document.getElementById('btnFoto');
    imagem = document.getElementById('imagem');

    cordova.plugin.http.setDataSerializer('json');

    btnNovo.addEventListener('click', onNovoClick, false);
    btnCancelar.addEventListener('click', onCancelarClick, false);
    btnSalvar.addEventListener('click', onSalvarClick, false);
    btnExcluir.addEventListener('click', onExcluirClick, false);
    btnFoto.addEventListener('click', tirarFoto, false);

    carregarPizzas();
}

function onNovoClick() {
    document.getElementById('pizza').value = "";
    document.getElementById('preco').value = "";
    imagem.style.backgroundImage = "none";
    indicePizzaEdicao = null;
    applista.style.display = 'none';
    appcadastro.style.display = 'flex';
}

function onCancelarClick() {
    applista.style.display = 'flex';
    appcadastro.style.display = 'none';
}

function onSalvarClick() {
    var inputPizza = document.getElementById('pizza');
    var inputPreco = document.getElementById('preco');
    var valorPizza = inputPizza.value.trim();
    var valorPreco = inputPreco.value.trim();

    var bg = imagem.style.backgroundImage;
    var valorImagem = "";
    if (bg.indexOf('data:image/jpeg;base64,') !== -1) {
        valorImagem = bg.replace('url("data:image/jpeg;base64,', '').replace('")', '');
    }

    if (valorPizza === "" || valorPreco === "" || valorImagem === "") {
        alert("Por favor, preencha todos os campos e capture uma foto!");
        return;
    }

    var dados = {
        pizzaria: PIZZARIA_ID,
        pizza: valorPizza,
        preco: parseFloat(valorPreco),
        imagem: valorImagem
    };

    var url = "https://pedidos-pizzaria.glitch.me/admin/pizza/";
    var metodo = (indicePizzaEdicao === null) ? 'post' : 'put';

    if (metodo === 'put') {
        dados.pizzaid = listaPizzasCadastradas[indicePizzaEdicao]._id;
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
    if (indicePizzaEdicao === null) {
        alert("Nenhuma pizza selecionada para excluir!");
        return;
    }

    var nomePizza = listaPizzasCadastradas[indicePizzaEdicao].pizza;
    var url = "https://pedidos-pizzaria.glitch.me/admin/pizza/" + PIZZARIA_ID + "/" + encodeURIComponent(nomePizza);

    cordova.plugin.http.delete(url, {}, {},
        function(response) {
            alert("Pizza excluída com sucesso!");
            carregarPizzas();
            applista.style.display = 'flex';
            appcadastro.style.display = 'none';
            indicePizzaEdicao = null;
            imagem.style.backgroundImage = "none";
        },
        function(error) {
            console.error("Erro ao excluir pizza:", error);
            alert("Erro ao excluir pizza.");
        }
    );
}

function tirarFoto() {
    navigator.camera.getPicture(onFotoSuccess, onFotoFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
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
                for (var i = 0; i < listaPizzasCadastradas.length; i++) {
                    var item = listaPizzasCadastradas[i];
                    var divLinha = document.createElement('div');
                    divLinha.classList.add('linha');
                    divLinha.innerHTML = item.pizza + " - R$ " + parseFloat(item.preco).toFixed(2);
                    divLinha.id = i;
                    divLinha.addEventListener('click', function() {
                        carregarDadosPizza(this.id);
                    }, false);
                    listaPizzasDiv.appendChild(divLinha);
                }
            }
        },
        function(error) {
            console.error("Erro ao carregar pizzas:", error);
            alert("Erro ao carregar pizzas. Verifique sua conexão com a internet.");
        }
    );
}

function carregarDadosPizza(id) {
    var pizzaData = listaPizzasCadastradas[id];
    if (pizzaData) {
        document.getElementById('pizza').value = pizzaData.pizza;
        document.getElementById('preco').value = pizzaData.preco;
        if (pizzaData.imagem) {
            imagem.style.backgroundImage = "url('data:image/jpeg;base64," + pizzaData.imagem + "')";
        } else {
            imagem.style.backgroundImage = "none";
        }
        indicePizzaEdicao = id;
        applista.style.display = 'none';
        appcadastro.style.display = 'flex';
    }
}