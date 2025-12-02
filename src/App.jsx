import { useState } from "react";
import erroImagem from '../public/erro.png';
import iconPerfil from '../public/perfil.png';

function App() {
  
  const [primeiroNome, setPrimeiroNome] = useState(""); 
  const [segundoNome, setSegundoNome] = useState("");
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [erroValor, setErroValor] = useState('')
  const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/;


  async function chamarAPI() {
    setCarregando(true) //  Defino carregando como true para ser carregado no layout
    setErro(false) // Defino erro como false para NÃO ser carregado no layout -> Esse é o boolean
    setErroValor("") // Defino erro como false para NÃO ser carregado no layout -> Esse é o texto do erro 
    setResultado(null) // Defino resultado como null pois quero zerar o resultado que veio da api anterior

    // Testo se primeiroNome e segundoNome corresponde as carecteres possiveis
    if (!nomeValido.test(primeiroNome) || !nomeValido.test(segundoNome)) {
      setErro(true)
      setErroValor("Digite um nome válido!")
      setCarregando(false)
      return;
    }

    // Caminho da minha api
    const url = `https://love-calculator.p.rapidapi.com/LoveCalculator/calculate?FirstName=${primeiroNome}&SecondName=${segundoNome}`; 

    // São as opções de requisição HTTP 
    const options = {
      method: "GET", // Defino que BUSCAR dados 
        headers: {
          "x-rapidapi-key": "9986711bdemshd6c760eb3de6d52p11d87ajsn8a5c4bc3bb76", // chave pessoal, seria meu indentificador
          "x-rapidapi-host": "love-calculator.p.rapidapi.com", // fala qual api quero acessar no rapidAPI
          "X-API-KEY": "de305d54-75b4-431b-adb2-eb6b9e546014" // Chave da API
        }
    };

    try {
      const response = await fetch(url, options); // espera receber o dado da api
      const data = await response.json(); // espera o json 

      setResultado(data) // salva os dados da api em resultado
      setHistorico(prev => [...prev, data]); // salva no histórico

    } catch (error) {
      // Caso aconteça algum erro na API
      setErro(true)
      setErroValor("Erro na chamada da API")
      console.error("Erro ao chamar a API:", error);
    } finally {
      // Defino carregando como false, a chamada da API foi finalizada
      setCarregando(false)
    }
  }

  return (
    <> 
      {/* Sidebar - Histórico */}
      <div className="fixed w-[250px] bg-white left-0 top-0 min-h-screen text-center px-4 pt-5">
        <h1 className="text-[30px] text-pink-400 font-bold pb-6">Histórico</h1>

          {historico.length == 0 && (
            <p className="text-gray-500">Nenhum cálculo feito ainda.</p>
          )}  

          <div className="overflow-y-auto h-[calc(100vh-130px)]">
            {/* Mapeia o histórico de cálculos de compatibilidade */}
            {historico.map((item, i) => (
              <div 
              key={i}
              className="my-2"
              >
                <div className="bg-pink-300 flex flex-col gap-2 p-2 rounded-2xl">
                  
                  <div className="flex items-center break-all">
                  <img src={iconPerfil} alt="Icone" className="w-4 h-4 mr-2"/> {item.firstName}
                  </div>
                  <div className="flex items-center break-all">
                  <img src={iconPerfil} alt="Icone" className="w-4 h-4 mr-2"/> {item.secondName} 
                  </div>
                  <div className="">
                  {item.percentage}%  de compatibilidade 💕
                  </div>
                </div>

              </div>

            ))}
          </div>

      </div>

      {/* Main - Calculadora */}
      <div className="bg-pink-50 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center text-center gap-10 bg-white p-10 rounded-[20px] min-x-[350px]">
          <p className="text-[30px] text-pink-400 font-bold max-w-[280px] ">Calculadora do Amor 💕</p>
          <input 
            type="text" 
            placeholder="Digite seu nome" 
            className="p-2 border-2 border-pink-300 w-full rounded-[7px] hover:border-pink-400 focus:border-pink-500 focus:outline-none"
            value={primeiroNome}
            onChange={textoDigitado => setPrimeiroNome(textoDigitado.target.value)}
          />
          
          <input 
            type="text" 
            placeholder="Digite o nome do seu Crush" 
            className="p-2 border-2 border-pink-300 w-full rounded-[7px] hover:border-pink-400 focus:border-pink-500 focus:outline-none"
            value={segundoNome}
            onChange={textoDigitado => setSegundoNome(textoDigitado.target.value)}
          />

          {/* Caso carregando seja TRUE vai aparecer */}
          {carregando ? (
            <button type="button" className="flex items-center px-4 py-2 bg-pink-400 text-white rounded-[7px]" xmlns="http://www.w3.org/2000/svg" disabled>  
              <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Carregando</span>
            </button>
          ) : (
            <button 
            className="bg-pink-400 text-white py-2 px-5 rounded-[7px] cursor-pointer 
            transition duration-300 ease-in-out
            hover:bg-pink-500 hover:scale-105"
            onClick={chamarAPI}
          >
            Calcule
          </button>
          )} 

          {/* Caso erro seja TRUE vai aparecer */}
          {erro && (
            <p className="text-red-500 font-bold bg-pink-200 p-2 rounded-[6px] flex text-center gap-1">
             <img src={erroImagem} alt="Erro" className="w-6 h-6"/> {erroValor}
            </p>
          )}


          {resultado && (
          <div className="flex flex-col gap-4 bg-pink-100 p-6 rounded-[20px] max-w-[300px] border-2 border-pink-200">
            <h1 className="font-bold text-[26px] break-all">{resultado.firstName} ❤️ {resultado.secondName}</h1>
            <p className="font-bold text-pink-500 text-[20px] pb-3">{resultado.percentage}% de compatibilidade</p>
            <p >Mensagem</p>
            <p>{resultado.result}</p>
            <p>Dica</p>
            <p>{resultado.tips}</p>
          </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App;
