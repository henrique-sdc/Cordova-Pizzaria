let pizzaEditando = null;
let listaPizzasCadastradas = [];
const PIZZARIA_ID = "pizzaria_do_ze";

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    //cordova.plugin.http.setDataSerializer('json');
    //console.log('Dispositivo pronto!');
    carregarPizzas();

    const applista = document.getElementById('applista');
    const appcadastro = document.getElementById('appcadastro');
    const btnNovo = document.getElementById('btnNovo');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnSalvar = document.getElementById('btnSalvar');
    const btnExcluir = document.getElementById('btnExcluir');
    const btnFoto = document.getElementById('btnFoto');
    const imagem = document.getElementById('imagem');

    btnNovo.addEventListener('click', () => {
        document.getElementById('pizza').value = "";
        document.getElementById('preco').value = "";
        imagem.style.backgroundImage = "none";
        pizzaEditando = null;
        applista.style.display = 'none';
        appcadastro.style.display = 'flex';
    });

    btnCancelar.addEventListener('click', () => {
        applista.style.display = 'flex';
        appcadastro.style.display = 'none';
    });

    btnSalvar.addEventListener('click', () => {
        console.log("Botão Salvar clicado!");
        const pizzaInput = document.getElementById('pizza');
        const precoInput = document.getElementById('preco');
        const pizzaValor = pizzaInput.value.trim();
        const precoValor = precoInput.value.trim();
        const imagemValor = imagem.style.backgroundImage;

        if(pizzaValor === "" || precoValor === ""){
            alert("Por favor, preencha todos os campos!");
            return;
        }
        
        if(pizzaEditando === null){
            listaPizzasCadastradas.push({
                pizza: pizzaValor,
                preco: parseFloat(precoValor),
                imagem: imagemValor
            });
        } else {
            listaPizzasCadastradas[pizzaEditando] = {
                pizza: pizzaValor,
                preco: parseFloat(precoValor),
                imagem: imagemValor
            };
            pizzaEditando = null;
        }
        
        localStorage.setItem('pizzas', JSON.stringify(listaPizzasCadastradas));
        carregarPizzas();
        applista.style.display = 'flex';
        appcadastro.style.display = 'none';
    });

    btnExcluir.addEventListener('click', () => {
        console.log("Botão Excluir clicado!");
        if(pizzaEditando === null){
            alert("Nenhuma pizza selecionada para excluir!");
            return;
        }
        listaPizzasCadastradas.splice(pizzaEditando, 1);
        localStorage.setItem('pizzas', JSON.stringify(listaPizzasCadastradas));
        carregarPizzas();
        pizzaEditando = null;
        imagem.style.backgroundImage = "none";
        applista.style.display = 'flex';
        appcadastro.style.display = 'none';
    });

    btnFoto.addEventListener('click', () => {
        console.log("Botão Foto clicado!");
        navigator.camera.getPicture(
            (imageData) => {
                console.log("Foto capturada!");
                imagem.style.backgroundImage = `url('data:image/jpeg;base64,${imageData}')`;
                if(pizzaEditando !== null){
                    listaPizzasCadastradas[pizzaEditando].imagem = `data:image/jpeg;base64,${imageData}`;
                    localStorage.setItem('pizzas', JSON.stringify(listaPizzasCadastradas));
                }
            },
            (error) => {
                console.log("Erro ao capturar foto:", error);
                alert("Erro ao tirar foto!");
            },
            {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                correctOrientation: true
            }
        );
    });
}

function carregarPizzas(){
    console.log("Função carregarPizzas() chamada!");
    const listaPizzasDiv = document.getElementById('listaPizzas');
    listaPizzasDiv.innerHTML = "";
    listaPizzasCadastradas = JSON.parse(localStorage.getItem('pizzas')) || [];
    listaPizzasCadastradas.forEach((item, idx) => {
        const novo = document.createElement('div');
        novo.classList.add('linha');
        novo.innerHTML = `${item.pizza} - R$ ${item.preco.toFixed(2)}`;
        novo.id = idx;
        novo.onclick = function(){
            carregarDadosPizza(novo.id);
        };
        listaPizzasDiv.appendChild(novo);
    });
}

function carregarDadosPizza(id){
    console.log("Carregar dados da pizza id:", id);
    const pizzaData = listaPizzasCadastradas[id];
    if(pizzaData){
        document.getElementById('pizza').value = pizzaData.pizza;
        document.getElementById('preco').value = pizzaData.preco;
        if(pizzaData.imagem){
            document.getElementById('imagem').style.backgroundImage = `url('${pizzaData.imagem}')`;
        } else {
            document.getElementById('imagem').style.backgroundImage = "none";
        }
        pizzaEditando = id;
        document.getElementById('applista').style.display = 'none';
        document.getElementById('appcadastro').style.display = 'flex';
    }
}
