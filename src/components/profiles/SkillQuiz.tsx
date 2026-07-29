import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Check, X, Award, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface Quiz {
  title: string;
  skillName: string;
  questions: Question[];
}

const QUIZZES: Record<string, Quiz> = {
  react_ts: {
    title: 'React & TypeScript Professional',
    skillName: 'React',
    questions: [
      {
        id: 1,
        question: 'Which type is the safest to use for variables with unknown types before verification?',
        options: ['any', 'unknown', 'never', 'object'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'What is the purpose of React 18\'s useTransition hook?',
        options: [
          'To handle CSS transitions on mount',
          'To mark state updates as non-blocking transitions',
          'To cache expensive calculation results',
          'To perform secure network requests'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        question: 'How do you define a generic constraint in TypeScript?',
        options: [
          '<T implements Type>',
          '<T extends Type>',
          '<T as Type>',
          '<T: Type>'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        question: 'In React, what type represents a component\'s child elements?',
        options: ['React.Node', 'React.Element', 'React.ReactNode', 'JSX.Element'],
        correctAnswerIndex: 2
      },
      {
        id: 5,
        question: 'Which utility type constructs a type with all properties of Type set to optional?',
        options: ['Required<Type>', 'Pick<Type>', 'Omit<Type>', 'Partial<Type>'],
        correctAnswerIndex: 3
      }
    ]
  },
  ui_ux: {
    title: 'UI/UX Design Systems Specialist',
    skillName: 'UI/UX Design',
    questions: [
      {
        id: 1,
        question: 'What does Fitts\'s Law state regarding interaction targets?',
        options: [
          'Colors must have at least a 4.5:1 contrast ratio',
          'The time to acquire a target is a function of target distance and size',
          'Users read screens in an F-shaped pattern',
          'Designs should always use a 12-column grid'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'Which contrast ratio is the minimum requirement for normal text under WCAG AA standards?',
        options: ['3.0:1', '4.5:1', '7.0:1', '2.0:1'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        question: 'What does "Visual Hierarchy" refer to in design?',
        options: [
          'The hierarchical folder organization of files in Figma',
          'The arrangement or presentation of elements in a way that implies importance',
          'The ranking of designer seniority in a studio',
          'The speed at which SVG icons load on the browser'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        question: 'What is the main benefit of using a Design System?',
        options: [
          'It replaces the need for standard frontend developers',
          'It guarantees absolute protection against copyright strikes',
          'It provides visual consistency, scalability, and accelerated prototyping',
          'It reduces the overall hosting costs of mobile apps'
        ],
        correctAnswerIndex: 2
      },
      {
        id: 5,
        question: 'What is a user persona?',
        options: [
          'A real user who signs an NDA contract',
          'A fictional representation of a target user based on research data',
          'The customer service agent character in chat support',
          'An animated avatar displayed on the loading skeleton page'
        ],
        correctAnswerIndex: 1
      }
    ]
  },
  python: {
    title: 'Python & Data Science Expert',
    skillName: 'Python',
    questions: [
      {
        id: 1,
        question: 'What is the correct way to handle exceptions in Python?',
        options: ['try/catch', 'try/except', 'try/finally', 'try/handle'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'What is the main difference between a list and a tuple in Python?',
        options: ['Lists are faster than tuples', 'Lists are mutable, tuples are immutable', 'Tuples can only contain numbers', 'Lists cannot be sliced'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        question: 'Which Python library is primarily used for numerical computations?',
        options: ['Django', 'Flask', 'NumPy', 'BeautifulSoup'],
        correctAnswerIndex: 2
      },
      {
        id: 4,
        question: 'What does the \'self\' keyword represent in Python class methods?',
        options: ['The class itself', 'The current instance of the class', 'A static reference', 'The parent class'],
        correctAnswerIndex: 1
      },
      {
        id: 5,
        question: 'How do you create a virtual environment in Python?',
        options: ['python -m venv myenv', 'python create env myenv', 'pip install venv', 'conda create env'],
        correctAnswerIndex: 0
      }
    ]
  },
  docker: {
    title: 'Docker & Containerization Expert',
    skillName: 'Docker',
    questions: [
      {
        id: 1,
        question: 'What is a Docker container?',
        options: ['A virtual machine with OS kernel', 'A lightweight, standalone executable package', 'A cloud storage bucket', 'A CI/CD pipeline step'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'What file is used to define a Docker image build process?',
        options: ['docker.conf', 'compose.yaml', 'Dockerfile', 'container.json'],
        correctAnswerIndex: 2
      },
      {
        id: 3,
        question: 'What is the purpose of Docker Compose?',
        options: ['To compress Docker images', 'To define and run multi-container applications', 'To monitor container logs', 'To build Docker images faster'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        question: 'Which command lists all running containers?',
        options: ['docker ps', 'docker list', 'docker show', 'docker status'],
        correctAnswerIndex: 0
      },
      {
        id: 5,
        question: 'What is a Docker volume used for?',
        options: ['To measure container size', 'To persist data beyond container lifecycle', 'To compress log files', 'To encrypt container data'],
        correctAnswerIndex: 1
      }
    ]
  },
  figma: {
    title: 'Figma Design Systems Specialist',
    skillName: 'Figma',
    questions: [
      {
        id: 1,
        question: 'What is an auto layout in Figma?',
        options: ['A plugin that auto-aligns layers', 'A constraint-based layout that adapts to content', 'An AI design generator', 'A batch export feature'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'What are Figma components?',
        options: ['Pre-built UI templates', 'Reusable design elements with master instances', 'Color palette presets', 'Font pairings'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        question: 'How can you share a Figma file for developer handoff?',
        options: ['Export as PNG and email it', 'Share a view-only link with inspect mode', 'Upload to GitHub', 'Print as PDF'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        question: 'What is the purpose of Figma variants?',
        options: ['To create different color themes', 'To group related component states into a single component set', 'To switch between light and dark mode', 'To export assets at multiple resolutions'],
        correctAnswerIndex: 1
      },
      {
        id: 5,
        question: 'What does it mean to "detach an instance" in Figma?',
        options: ['Remove the component from the library', 'Disconnect it from the main component, making it a local copy', 'Delete the master component', 'Move it to a different page'],
        correctAnswerIndex: 1
      }
    ]
  },
  postgresql: {
    title: 'PostgreSQL Database Architect',
    skillName: 'PostgreSQL',
    questions: [
      {
        id: 1,
        question: 'What type of database is PostgreSQL?',
        options: ['NoSQL document database', 'Relational object-oriented database', 'In-memory key-value store', 'Graph database'],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'What is a PostgreSQL index used for?',
        options: ['To organize table content alphabetically', 'To speed up query execution by enabling faster data retrieval', 'To compress stored data', 'To encrypt sensitive columns'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        question: 'Which SQL clause filters groups formed by GROUP BY?',
        options: ['WHERE', 'HAVING', 'FILTER', 'CONDITION'],
        correctAnswerIndex: 1
      },
      {
        id: 4,
        question: 'What does ACID stand for in database transactions?',
        options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Authorization, Concurrency, Isolation, Data', 'Atomicity, Concurrency, Isolation, Durability'],
        correctAnswerIndex: 0
      },
      {
        id: 5,
        question: 'What is a PostgreSQL view?',
        options: ['A physical copy of a table', 'A saved virtual table based on a query result', 'A dashboard for monitoring queries', 'A backup of database schema'],
        correctAnswerIndex: 1
      }
    ]
  },
  node_js: {
    title: 'Node.js Backend Systems Architect',
    skillName: 'Node.js',
    questions: [
      {
        id: 1,
        question: 'What is the primary role of the event loop in Node.js?',
        options: [
          'To run multiple system processes concurrently using CPU cores',
          'To handle asynchronous callback execution in a single-threaded architecture',
          'To cache database query responses automatically',
          'To compile JavaScript files directly into machine binary'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 2,
        question: 'Which method in Node.js is used to schedule a callback to run immediately in the next phase of the event loop?',
        options: ['setTimeout', 'process.nextTick', 'setImmediate', 'setInterval'],
        correctAnswerIndex: 1
      },
      {
        id: 3,
        question: 'What is the purpose of middleware in Express.js applications?',
        options: [
          'To host static styling assets on cloud servers',
          'To write complex database queries safely',
          'To inspect and modify request/response objects during routing execution',
          'To generate automatic API client SDK bindings'
        ],
        correctAnswerIndex: 2
      },
      {
        id: 4,
        question: 'What does CORS stand for?',
        options: [
          'Core Object Routing System',
          'Cross-Origin Resource Sharing',
          'Client-Only Request Shield',
          'Common Operations Render Stack'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 5,
        question: 'Which system module is used to handle path manipulations in Node.js?',
        options: ['fs', 'os', 'path', 'http'],
        correctAnswerIndex: 2
      }
    ]
  }
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultQuizKey?: string;
}

export const SkillQuiz: React.FC<Props> = ({ isOpen, onClose, defaultQuizKey }) => {
  const { currentUser, verifySkill } = useApp();
  const { addToast } = useToast();

  const [selectedQuizKey, setSelectedQuizKey] = useState<string | null>(defaultQuizKey || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(30); // 30s per question
  const [quizFinished, setQuizFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [score, setScore] = useState(0);

  const activeQuiz = selectedQuizKey ? QUIZZES[selectedQuizKey] : null;

  useEffect(() => {
    if (!activeQuiz || quizFinished) return;

    setTimeLeft(30);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedQuizKey, currentQuestionIndex, quizFinished]);

  if (!isOpen) return null;

  const handleStartQuiz = (key: string) => {
    setSelectedQuizKey(key);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setTimeLeft(30);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (quizFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const isPassed = correctCount >= 4; // 80% passing mark
    setScore(correctCount);
    setPassed(isPassed);
    setQuizFinished(true);

    if (isPassed) {
      verifySkill(currentUser.id, activeQuiz.skillName);
      addToast(`Skill Verified: Passed the ${activeQuiz.skillName} Assessment!`, 'success');
    } else {
      addToast('Assessment completed. You can try again to get verified.', 'warning');
    }
  };

  const renderQuizContent = () => {
    if (!selectedQuizKey) {
      return (
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto">
            <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-2xl font-heading font-extrabold text-white">Skill Verification Quizzes</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Pass a 5-question technical quiz with 80% or higher to earn a Verified Skill badge on your profile.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {Object.entries(QUIZZES).map(([key, q]) => (
              <button key={key} onClick={() => handleStartQuiz(key)}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 text-left transition-all group flex flex-col justify-between h-44">
                <div>
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-sm">{q.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Verify: {q.skillName}</p>
                </div>
                <div className="flex items-center justify-between w-full pt-4">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">5 MCQ Questions</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
    if (activeQuiz && !quizFinished) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{activeQuiz.title}</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <Clock className={`w-4 h-4 ${timeLeft < 10 ? 'text-rose-400 animate-pulse' : 'text-zinc-400'}`} />
              <span className={`text-xs font-mono font-bold ${timeLeft < 10 ? 'text-rose-400' : 'text-slate-200'}`}>{timeLeft}s</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }} />
          </div>
          <div className="py-2">
            <p className="text-base text-white font-medium">{activeQuiz.questions[currentQuestionIndex].question}</p>
          </div>
          <div className="space-y-3">
            {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              return (
                <button key={idx} onClick={() => handleAnswerSelect(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${isSelected ? 'bg-emerald-500/10 border-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/5' : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/80'}`}>
                  <span>{option}</span>
                  {isSelected && <span className="w-5 h-5 bg-emerald-500 text-black rounded-full flex items-center justify-center"><Check className="w-3 h-3 stroke-[3]" /></span>}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
            <button onClick={() => setSelectedQuizKey(null)} className="text-xs text-zinc-400 hover:text-white transition-colors">Quit Quiz</button>
            <button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="px-5 py-2 rounded-xl bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5">
              <span>{currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }
    if (activeQuiz && quizFinished) {
      return (
        <div className="text-center py-6 space-y-6">
          <div className="mx-auto max-w-sm">
            {passed ? (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/5">
                  <ShieldCheck className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">Assessment Passed!</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Congratulations! You scored <span className="font-bold text-emerald-400">{score}/{activeQuiz.questions.length}</span> ({Math.round((score/activeQuiz.questions.length)*100)}%). The skill <span className="font-semibold text-white">{activeQuiz.skillName}</span> is now verified on your profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-rose-500/5">
                  <HelpCircle className="w-12 h-12 text-rose-400" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-white">Assessment Failed</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  You scored <span className="font-bold text-rose-400">{score}/{activeQuiz.questions.length}</span>. A score of 80% (4/5) or higher is required to gain verification. Keep learning and try again!
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-800/80">
            <button onClick={() => setSelectedQuizKey(null)}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-white font-bold transition-all">Go Back to Quizzes</button>
            {!passed && <button onClick={() => handleStartQuiz(selectedQuizKey)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all">Retake Assessment</button>}
            {passed && <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all">Done</button>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-5 top-5 p-1.5 bg-zinc-905 rounded-full text-zinc-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {renderQuizContent()}
      </div>
    </div>
  );
};
