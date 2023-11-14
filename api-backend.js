let form1 = document.querySelector('#form1');
let resultado = document.querySelector('#resultado');

form1.addEventListener('submit', function (event) {
    event.preventDefault();

    const dadosForm = new FormData(form1);
    const parametros = new URLSearchParams(dadosForm).toString();

    buscarFilmes(parametros);
    let c1 = document.querySelector('#c1');
    let c2 = document.querySelector('#c2');
    let c3 = document.querySelector('#c3');
    c1.innerHTML = '';
    c2.innerHTML = '';
    c3.innerHTML = '';
});

function buscarFilmes(parametros) {
    console.log('Parametros enviados:', parametros);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjN2U1ZjRkMjYwZDM2Y2VjYWJhODU4ZTg3M2UxNTQ3YSIsInN1YiI6IjY1M2U5YjQ5NTE5YmJiMDBmZTVkMGI5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KMBr7BvoTAiljylflKQWXF3NQgz7_r0nORXXmPQaIyI'
        }
    };

    fetch('https://api.themoviedb.org/3/search/movie?include_adult=false&language=pt-BR&page=1&'+parametros, options)
        .then(response => {
            if (response.ok) {
                console.log('Deu bom!', response.status);
                return response.json();
            } else {
                console.log('Deu ruim!');
                throw new Error('Erro na primeira busca');
            }
        })
        .then(data=>{
            console.log(data);
            let filmes = data.results;
            if (filmes && filmes.length > 0) {
                const primeiroFilme = filmes[0];
                const tituloOriginal = primeiroFilme.original_title;
                console.log('Título original:', tituloOriginal);
                filme(tituloOriginal);
            } else {
                console.log('Nenhum filme encontrado.');
            }
        })
        .catch(error => {
            console.error('Erro na busca de filmes:', error);
        });
}


function filme(tituloOriginal) {
    console.log('Título original enviado:', tituloOriginal);
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
           "ngrok-skip-browser-warning": true,
        }),
    };
    console.log('URL da solicitação fetch:', `https://728e-35-231-10-232.ngrok-free.app/?query=${encodeURIComponent(tituloOriginal)}`);

    fetch(`https://728e-35-231-10-232.ngrok-free.app/?query=${encodeURIComponent(tituloOriginal)}`, options)
        .then(response => {
            if (response.ok) {
                console.log("Iiiihhhaaa");
                return response.json();
            } else {
                console.log("Rapaaaiiizzzz. Status:", response.status);
                throw new Error('Erro na segunda busca');
            }
        })
        .then(data => {
            console.log('Dados recebidos da segunda busca:', data);
            if (Array.isArray(data) && data.length > 0) {
                let filmes = data;
                filmes.forEach((filme, index) => {
                    let titulo = document.createElement('h2');
                    titulo.innerText=filme.title;
                    console.log(titulo)
                    let nota = document.createElement('p');
                    nota.innerText = filme.vote_average.toFixed(1);
                    let generos = document.createElement('p');
                    generos.innerText = filme.genres.slice(0, 3).join(', ');
                    let elenco = document.createElement('p');
                    elenco.innerText = filme.elenco.slice(0, 3).join(', ');
    
                    let data = document.createElement('p');
                    let dataOriginal = new Date(filme.data);
                    let ano = dataOriginal.getFullYear();
                    data.innerText = ano;
    
                    let poster = document.createElement('img');
                    poster.src = filme.poster;
                    poster.alt = "Poster do Filme";
    
                    let resultado;
                    if (index === 0) {
                        resultado = c1;
                    } else if (index === 1) {
                        resultado = c2;
                    } else if (index === 2) {
                        resultado = c3;
                    }
    
    
                    resultado.appendChild(titulo)
                    resultado.appendChild(nota)
                    resultado.appendChild(generos)
                    resultado.appendChild(elenco)
                    resultado.appendChild(data)
                    resultado.appendChild(poster)
                });
            } else {
                console.log('Nenhum dado válido recebido da segunda busca.');
            }
        })
}

