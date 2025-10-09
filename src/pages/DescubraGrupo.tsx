import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import hawiseImg from "@/assets/hawise.png";
import jocosaImg from "@/assets/jocosa.png";
import dragomirImg from "@/assets/dragomir.png";
import brendaImg from "@/assets/brenda.png";

const questions = [
  {
    question: "Você ouve um barulho inesperado na madrugada. O que você faz?",
    options: [
      { value: "A", label: "Vou investigar imediatamente sem hesitar" },
      { value: "B", label: "Avalio a situação antes de decidir o que fazer" },
      { value: "C", label: "Imagino que não é nada e volto a dormir" },
      { value: "D", label: "Fico atento mas mantenho a calma" }
    ]
  },
  {
    question: "Você tem uma tarde livre sem compromissos. Como você a usa?",
    options: [
      { value: "A", label: "Leio algo interessante ou assisto um documentário" },
      { value: "B", label: "Saio para dar uma volta sem destino certo" },
      { value: "C", label: "Pratico um esporte ou faço algo físico" },
      { value: "D", label: "Fico em casa apreciando o silêncio" }
    ]
  },
  {
    question: "Alguém comete um erro grave que afeta você. Como reage?",
    options: [
      { value: "A", label: "Deixo passar e busco não guardar ressentimento" },
      { value: "B", label: "Tento aliviar o clima com humor" },
      { value: "C", label: "Converso para entender o que aconteceu" },
      { value: "D", label: "Sinto raiva mas tento controlar" }
    ]
  },
  {
    question: "Se pudesse viajar agora, para onde iria?",
    options: [
      { value: "A", label: "Um museu ou biblioteca famosa" },
      { value: "B", label: "Um parque de aventuras ou lugar radical" },
      { value: "C", label: "Uma praia deserta e tranquila" },
      { value: "D", label: "Um retiro nas montanhas" }
    ]
  },
  {
    question: "Durante uma conversa profunda, você geralmente:",
    options: [
      { value: "A", label: "Muda de assunto para algo mais leve" },
      { value: "B", label: "Ouve mais do que fala" },
      { value: "C", label: "Faz perguntas para aprofundar o tema" },
      { value: "D", label: "Compartilha suas próprias experiências com emoção" }
    ]
  },
  {
    question: "Você está em uma multidão. Como se sente?",
    options: [
      { value: "A", label: "Empolgado com toda essa energia" },
      { value: "B", label: "Bem, mas prefiro grupos menores" },
      { value: "C", label: "Um pouco desconfortável" },
      { value: "D", label: "Observo as pessoas ao redor" }
    ]
  },
  {
    question: "Você presencia uma injustiça. Qual sua reação?",
    options: [
      { value: "A", label: "Interfiro imediatamente" },
      { value: "B", label: "Penso na melhor forma de ajudar" },
      { value: "C", label: "Tento mediar a situação" },
      { value: "D", label: "Tento desescalar o conflito com palavras" }
    ]
  },
  {
    question: "Como você aproveita um tempo sozinho?",
    options: [
      { value: "A", label: "Medito ou simplesmente não faço nada" },
      { value: "B", label: "Organizo meus pensamentos e planos" },
      { value: "C", label: "Ouço música ou danço" },
      { value: "D", label: "Sinto falta de companhia logo" }
    ]
  },
  {
    question: "Você recebe uma notícia muito boa. Como reage?",
    options: [
      { value: "A", label: "Comemoro com entusiasmo!" },
      { value: "B", label: "Sorrio e agradeço internamente" },
      { value: "C", label: "Analiso o que isso significa para meu futuro" },
      { value: "D", label: "Sinto alegria mas de forma contida" }
    ]
  },
  {
    question: "Alguém critica algo que você fez. Sua primeira reação é:",
    options: [
      { value: "A", label: "Reflito sobre o feedback" },
      { value: "B", label: "Me defendo com firmeza" },
      { value: "C", label: "Faço uma piada sobre a situação" },
      { value: "D", label: "Aceito sem me abalar muito" }
    ]
  }
];

const groupData = {
  hawise: {
    name: "Hawise",
    description: "Conhecidos pela sua personalidade eufórica e comumente associada a pessoas que gostam de batalhas. Você carrega uma energia intensa e é movido pela adrenalina de desafios e conquistas.",
    theme: "from-red-600 to-red-800",
    textColor: "text-red-100",
    image: hawiseImg
  },
  jocosa: {
    name: "Jocosa",
    description: "Tem a personalidade de leveza, é alguém que carrega uma aura tranquila e serena, capaz de transformar o ambiente apenas com sua presença. Você tende a lidar com a vida de forma descomplicada, sem se deixar abalar facilmente por problemas ou tensões.",
    theme: "from-green-600 to-green-800",
    textColor: "text-green-100",
    image: jocosaImg
  },
  dragomir: {
    name: "Dragomir",
    description: "Tem a personalidade de paz, é alguém que carrega silêncio por dentro, não por falta de voz, mas por equilíbrio. Você transmite tranquilidade genuína, não sente necessidade de disputar, convencer ou se impor, apenas estar presente já basta para acalmar quem está por perto.",
    theme: "from-cyan-600 to-cyan-800",
    textColor: "text-cyan-100",
    image: dragomirImg
  },
  brenda: {
    name: "Brenda",
    description: "Tem a personalidade inteligente, é alguém que observa antes de agir, e pensa antes de falar. Sua mente é ágil, analítica e curiosa, sempre buscando entender o porquê das coisas. Você enxerga conexões onde outros veem apenas fragmentos, e transforma informação em compreensão profunda.",
    theme: "from-purple-600 to-purple-800",
    textColor: "text-purple-100",
    image: brendaImg
  }
};

const DescubraGrupo = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingResult();
  }, []);

  const checkExistingResult = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('check-quiz-result', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      if (data.hasResult) {
        setResult(data.group);
        setIsExisting(true);
      }
    } catch (error) {
      console.error('Error checking existing result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast({
        title: "Selecione uma resposta",
        description: "Por favor, escolha uma opção antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('submit-quiz', {
        body: { 
          answers,
          userId: user?.id 
        }
      });

      if (error) throw error;

      setResult(data.group);
      setIsExisting(data.isExisting);
      
      if (data.isExisting) {
        toast({
          title: "Resultado Anterior",
          description: "Você já fez este quiz! Mostrando seu resultado anterior.",
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o quiz. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16 flex-grow flex items-center justify-center">
          <p className="text-primary text-xl">Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (result) {
    const group = groupData[result as keyof typeof groupData];
    return (
      <div className="min-h-screen bg-dark flex flex-col">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-32 pb-16 flex-grow">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-title">Voltar</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary text-glow animate-fade-in mb-8 text-center">
              {isExisting ? "Seu Resultado" : "Seu Grupo é..."}
            </h1>
            
            <Card className={`bg-gradient-to-br ${group.theme} border-none animate-fade-in`}>
              <CardHeader>
                <div className="flex flex-col items-center gap-6">
                  <img 
                    src={group.image} 
                    alt={group.name}
                    className="w-48 h-48 object-contain"
                  />
                  <CardTitle className={`text-5xl font-title ${group.textColor}`}>
                    {group.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className={`text-xl text-center ${group.textColor} leading-relaxed`}>
                  {group.description}
                </CardDescription>
              </CardContent>
            </Card>

            {isExisting && (
              <p className="text-center text-foreground/60 mt-8">
                Você já completou este quiz anteriormente. Apenas um resultado por pessoa é permitido.
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16 flex-grow">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-title">Voltar</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-title font-bold text-primary text-glow animate-fade-in mb-8 text-center">
            Descubra seu Grupo
          </h1>
          
          <Card className="bg-dark-card border-primary/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-primary font-title">
                Pergunta {currentQuestion + 1} de {questions.length}
              </CardTitle>
              <CardDescription className="text-lg text-foreground/80">
                {questions[currentQuestion].question}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswer}
              >
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-primary/10 transition-colors">
                    <RadioGroupItem value={option.value} id={`q${currentQuestion}-${option.value}`} />
                    <Label 
                      htmlFor={`q${currentQuestion}-${option.value}`}
                      className="text-foreground cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between gap-4 pt-4">
                <Button
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="w-full"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Processando..." : currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
                </Button>
              </div>

              <div className="w-full bg-primary/20 rounded-full h-2 mt-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DescubraGrupo;
