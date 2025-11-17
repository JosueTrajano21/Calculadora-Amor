import { useEffect, useState } from "react";

function App() {
  
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/;

  useEffect(() => {
    console.log(historico)
  }, [historico])

  async function chamarAPI() {
    setCarregando(true)
    setErro(false)
    setResultado(null)

    if (!nomeValido.test(firstName) || !nomeValido.test(secondName)) {
      setErro(true)
      setCarregando(false)
      return;
    }

    const url = `https://love-calculator.p.rapidapi.com/LoveCalculator/calculate?FirstName=${firstName}&SecondName=${secondName}`; 

    const options = {
      method: "GET",
        headers: {
          "x-rapidapi-key": "9986711bdemshd6c760eb3de6d52p11d87ajsn8a5c4bc3bb76", // chave pessoal, seria meu indentificador
          "x-rapidapi-host": "love-calculator.p.rapidapi.com", // fala qual api quero acessar no rapidAPI
          "X-API-KEY": "de305d54-75b4-431b-adb2-eb6b9e546014"
        }
    };

    try {
      const response = await fetch(url, options); // espera receber o dado da api
      const data = await response.json(); // espera o json 

      setResultado(data) // salva os dados da api em resultado
      setHistorico(prev => [...prev, data]); // salva no histórico

    } catch (error) {
      setErro(true)
      console.error("Erro ao chamar a API:", error);

    } finally {
      setCarregando(false)
    }
  }

  // chama a função assim que o componente for renderizado

  return (
    <> 

      {/* Sidebar - Histórico */}
      <div className="fixed w-[200px] bg-white left-0 top-0 min-h-screen text-center px-8 pt-5">
        <h1 className="text-[30px] text-pink-400 font-bold pb-6">Histórico</h1>

          {historico.length == 0 && (
            <p className="text-gray-500">Nenhum cálculo feito ainda.</p>
          )}  

          <div className="overflow-y-auto h-[calc(100vh-130px)]">
            {historico.map((item, i) => (
              <div key={i}>
                <p>{item.firstName} 💕 {item.secondName} - {item.percentage}%</p>
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
            value={firstName}
            onChange={(textoDigitado) => setFirstName(textoDigitado.target.value)}
          />
          
          <input 
            type="text" 
            placeholder="Digite o nome do seu Crush" 
            className="p-2 border-2 border-pink-300 w-full rounded-[7px] hover:border-pink-400 focus:border-pink-500 focus:outline-none"
            value={secondName}
            onChange={e => setSecondName(e.target.value)}
          />

          <button 
            className="bg-pink-400 text-white py-2 px-5 rounded-[7px] cursor-pointer 
            transition duration-300 ease-in-out
            hover:bg-pink-500 hover:scale-105"
            onClick={chamarAPI}
          >
            Calcule
          </button>

          {erro && (
            <p className="text-red-600 font-bold">
              Erro!
            </p>
          )}

          {carregando && (
            <p >
              Carregando..!
            </p>
          )}  
          
          {resultado && (
          <div className="flex flex-col gap-4 bg-pink-100 p-6 rounded-[20px] max-w-[300px] border-2 border-pink-200">
            <h1 className="font-bold text-[26px]">{resultado.firstName} ❤️ {resultado.secondName}</h1>
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
