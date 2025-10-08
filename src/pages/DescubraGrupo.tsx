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
    question: "Como você reage em uma situação de conflito?",
    options: [
      { value: "A", label: "Enfrento de frente com energia e determinação" },
      { value: "B", label: "Analiso a situação com calma antes de agir" },
      { value: "C", label: "Busco manter a paz e o equilíbrio" },
      { value: "D", label: "Procuro descontrair e aliviar a tensão" }
    ]
  },
  {
    question: "Em um momento de relaxar, você prefere:",
    options: [
      { value: "A", label: "Atividades tranquilas e serenas" },
      { value: "B", label: "Ler ou aprender algo novo" },
      { value: "C", label: "Meditar ou contemplar em silêncio" },
      { value: "D", label: "Atividades físicas ou competitivas" }
    ]
  },
  {
    question: "Diante de um problema difícil, você:",
    options: [
      { value: "A", label: "Age rapidamente com confiança" },
      { value: "B", label: "Deixa fluir naturalmente" },
      { value: "C", label: "Pensa profundamente antes de decidir" },
      { value: "D", label: "Permanece calmo e equilibrado" }
    ]
  },
  {
    question: "Qual palavra melhor descreve você?",
    options: [
      { value: "A", label: "Eufórico" },
      { value: "B", label: "Leve" },
      { value: "C", label: "Pacífico" },
      { value: "D", label: "Inteligente" }
    ]
  },
  {
    question: "Como você gosta de passar um fim de semana?",
    options: [
      { value: "A", label: "Participando de competições ou desafios" },
      { value: "B", label: "Relaxando sem compromissos" },
      { value: "C", label: "Em contemplação ou atividades calmas" },
      { value: "D", label: "Estudando ou explorando novos conhecimentos" }
    ]
  },
  {
    question: "Ao tomar uma decisão importante, você:",
    options: [
      { value: "A", label: "Analisa todos os ângulos cuidadosamente" },
      { value: "B", label: "Confia na sua intuição e age" },
      { value: "C", label: "Segue o caminho mais leve e natural" },
      { value: "D", label: "Busca o equilíbrio entre todas as opções" }
    ]
  },
  {
    question: "Em um grupo de amigos, você é:",
    options: [
      { value: "A", label: "O animado que traz energia" },
      { value: "B", label: "O que mantém tudo leve e descontraído" },
      { value: "C", label: "O mediador que traz paz" },
      { value: "D", label: "O conselheiro sábio" }
    ]
  },
  {
    question: "Quando enfrenta um desafio, você:",
    options: [
      { value: "A", label: "Se empolga e mergulha de cabeça" },
      { value: "B", label: "Elabora uma estratégia detalhada" },
      { value: "C", label: "Enfrenta com leveza, sem estresse" },
      { value: "D", label: "Mantém a calma e age com serenidade" }
    ]
  },
  {
    question: "Quando está estressado, você:",
    options: [
      { value: "A", label: "Libera energia através de ação" },
      { value: "B", label: "Busca silêncio e introspecção" },
      { value: "C", label: "Procura algo que te faça rir" },
      { value: "D", label: "Reflete sobre o problema racionalmente" }
    ]
  },
  {
    question: "Qual você considera sua maior qualidade?",
    options: [
      { value: "A", label: "Coragem e determinação" },
      { value: "B", label: "Leveza e positividade" },
      { value: "C", label: "Paz interior e equilíbrio" },
      { value: "D", label: "Inteligência e análise" }
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
  const [isLoading, setIsLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke('submit-quiz', {
        body: { answers }
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

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setIsExisting(false);
  };

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
