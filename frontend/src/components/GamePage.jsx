import React, { useState, useEffect } from 'react';

export default function GamePage({ sectionName, onBack, onOpenGift }) {
  // Game states: 'chapter_select' | 'intro' | 'choice' | 'suspense' | 'result'
  const [gameState, setGameState] = useState('chapter_select');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [coinResult, setCoinResult] = useState(null); // 'good' | 'bad'
  const [suspenseText, setSuspenseText] = useState('Đang cân nhắc quyết định...');
  const [history, setHistory] = useState([]); // Tracks played rounds
  const [unlockedChapters, setUnlockedChapters] = useState([1]); // Sequential progression

  // Load progress from localStorage on mount
  useEffect(() => {
    const maxUnlocked = parseInt(localStorage.getItem('max_unlocked_chapter') || '1');
    const unlocked = [];
    for (let i = 1; i <= maxUnlocked; i++) {
      unlocked.push(i);
    }
    setUnlockedChapters(unlocked);
  }, []);

  // Chapters Data
  const chapters = {
    1: {
      id: 1,
      title: "Chương 1: Thời điểm đầu xã hội chưa hình thành",
      subtitle: "Thời kỳ Nguyên thủy - Bầy người nguyên thủy",
      description: "Bạn là Tù trưởng của một bộ tộc nguyên thủy đang đứng trước mùa đông khắc nghiệt đầu tiên. Công cụ lao động còn cực kỳ thô sơ (đá ghè đẽo, cành cây thô). Mọi quyết định của bạn sẽ định hình số phận của bộ tộc, và thiên nhiên khắc nghiệt sẽ phản hồi qua sự may rủi của số phận.",
      images: {
        title: "/game/chapter1_title.jpg",
        options: "/game/chapter1_options.jpg",
        good: "/game/chapter1_good.jpg",
        bad: "/game/chapter1_bad.jpg"
      },
      choices: {
        A: {
          id: "A",
          title: "Săn bắn",
          hasBakedText: true,
          good: {
            title: "Săn Bắn Thành Công!",
            text: "", // Baked in image: "Dân làng săn thành công thú, lương thực được đảm bảo"
            image: "/game/chapter1_good.jpg",
            effect: "Lương thực dồi dào, uy tín của Tù trưởng tăng cao (+20 Điểm Sinh Tồn)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Tai Họa Mammoth Tấn Công!",
            text: "", // Baked in image: "Do công cụ còn thô sơ, nên dân làng bị thú lớn tấn công, dân số giảm"
            image: "/game/chapter1_bad.jpg",
            effect: "Thiệt hại người và của, tinh thần bộ lạc suy sụp (-20 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        B: {
          id: "B",
          title: "Hái lượm an toàn",
          hasBakedText: true,
          good: {
            title: "Hái Lượm Thành Công!",
            text: "", // Baked in image: "Dân làng thu hoạch được nhiều hoa quả, lương thực được đảm bảo"
            image: "/game/chapter1_b_good.jpg",
            effect: "Thu hoạch dồi dào, tích lũy thêm lương thực dự phòng (+15 Điểm Sinh Tồn)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Mùa Vụ Thất Thu!",
            text: "", // Baked in image: "Do công cụ còn thô sơ, nên dân làng không thu hoạch được nhiều lương thực, dẫn đến đói kém"
            image: "/game/chapter1_b_bad.jpg",
            effect: "Công cụ thô sơ cản trở, lương thực thiếu hụt nghiêm trọng (-15 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        C: {
          id: "C",
          title: "Chế tạo công cụ",
          hasBakedText: true,
          singleOutcome: "good",
          good: {
            title: "Chế Tạo Thành Công!",
            text: "", // Baked in image: "Dân làng chế tạo được công cụ để săn bắn, hái lượm hiệu quả hơn, lương thực được đảm bảo"
            image: "/game/chapter1_c_good.jpg",
            effect: "Lực lượng sản xuất cải tiến, tăng hiệu quả săn bắn hái lượm (+25 Điểm Công Nghệ)",
            overlay: "rgba(46, 204, 113, 0.05)"
          }
        },
        D: {
          id: "D",
          title: "Không làm gì cả",
          hasBakedText: true,
          singleOutcome: "bad",
          bad: {
            title: "Bộ Tộc Diệt Vong!",
            text: "", // Baked in image: "Không tạo ra bất kỳ sản phẩm vật chất nào, xã hội không phát triển, dân làng diệt vong"
            image: "/game/chapter1_d_bad.jpg",
            effect: "Sản xuất vật chất đình trệ hoàn toàn, bộ tộc suy kiệt và tan rã (-50 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        }
      }
    },
    2: {
      id: 2,
      title: "Chương 2: Xã hội bắt đầu hình thành",
      subtitle: "Thời kỳ tan rã của Thị tộc - Công cụ kim loại phát triển",
      description: "Bạn là Hội trưởng Hội đồng Thị tộc trong giai đoạn lực lượng sản xuất phát triển mạnh mẽ. Con người đã biết trồng trọt, xây nhà kiên cố. Mối quan hệ sản xuất có sự chuyển biến: bắt đầu xuất hiện tư hữu và sự tích lũy của cải. Hãy quyết định phân chia tài sản để định hình lịch sử!",
      images: {
        title: "/game/chapter2_title.jpg",
        options: "/game/chapter2_options.jpg",
        good: "/game/chapter2_good.jpg",
        bad: "/game/chapter2_bad.jpg"
      },
      choices: {
        A: {
          id: "A",
          title: "Chia đều",
          hasBakedText: true, // Choice A has text baked in images 3 & 4
          good: {
            title: "Cộng Đồng Phát Triển!",
            text: "", // Baked in image: "Dân làng ai cũng có của cải, mọi người hỗ trợ lẫn nhau, xã hội phát triển"
            image: "/game/chapter2_good.jpg",
            effect: "Mọi thành viên cùng có của cải, xã hội tương trợ bền vững (+20 Điểm Sinh Tồn)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Thoái Hóa Lười Lao Động!",
            text: "", // Baked in image: "Một số người nhận ra việc lao động ít nhưng vẫn có thể nhận ngang những người khác nên sinh ra tâm lý lười làm việc, lâu dần nhiều người cũng làm theo, xã hội dần thoái hóa, kinh tế sụp đổ"
            image: "/game/chapter2_bad.jpg",
            effect: "Ỷ lại phân phối cào bằng, tinh thần lao động suy sụp (-25 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        B: {
          id: "B",
          title: "Ai làm nhiều hưởng nhiều",
          hasBakedText: true, // Choice B now has text baked directly in images
          good: {
            title: "Động Lực Sản Xuất!",
            text: "", // Baked in image: "Dân làng siêng năng, chăm chỉ làm việc, cố gắng tích lũy tài sản riêng, xã hội phát triển"
            image: "/game/chapter2_b_good.jpg",
            effect: "Kích thích tư hữu lành mạnh, của cải xã hội dồi dào (+20 Điểm Năng Suất)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Nổi Loạn Giàu Nghèo!",
            text: "", // Baked in image: "Một số người sinh ra tính ích kỷ, đố kị khi có những người tích lũy nhiều hơn mình, khoảng cách giàu nghèo được hình thành, bắt đầu có nổi loạn, xã hội sụp đổ"
            image: "/game/chapter2_b_bad.jpg",
            effect: "Mối quan hệ cộng đồng rạn nứt, nổi loạn nổ ra gây sụp đổ nội bộ (-15 Điểm Đoàn Kết)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        C: {
          id: "C",
          title: "Không làm gì cả",
          hasBakedText: true, // Now C has baked text
          singleOutcome: "bad", // 100% fail!
          bad: {
            title: "Mâu Thuẫn Xã Hội!",
            text: "", // Baked in image: "Các mâu thuẫn xã hội bắt đầu tăng mà không có ai đứng ra giải quyết, xã hội sụp đổ"
            image: "/game/chapter2_c_bad.jpg",
            effect: "Kinh tế đình trệ, xã hội sụp đổ do mâu thuẫn nội bộ (-30 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        D: {
          id: "D",
          title: "Lấy hết về phần mình",
          hasBakedText: true, // Now D has baked text
          good: {
            title: "Thiết Lập Độc Tài!",
            text: "", // Baked in image: "Bạn thành công thao túng xã hội, góp nhặt được nhiều của cải, trở thành thống lĩnh tối cao, xã hội độc tài được hình thành"
            image: "/game/chapter2_d_good.jpg",
            effect: "Hình thành giai cấp cai trị chuyên chế, độc chiếm tài sản xã hội (+25 Điểm Tập Quyền)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Đấu Tranh & Lật Đổ!",
            text: "", // Baked in image: "Người dân nhận ra sự tham lam của bạn, bắt đầu hình thành những hình thức đấu tranh và lật đổ bạn, thay thế bằng một trưởng làng khác"
            image: "/game/chapter2_d_bad.jpg",
            effect: "Nhân dân đấu tranh giành lại tư liệu sản xuất, chính quyền sụp đổ (-35 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        }
      }
    },
    3: {
      id: 3,
      title: "Chương 3: Xã hội bắt đầu phát triển",
      subtitle: "Thời kỳ phân hóa văn hóa - Tôn giáo và nghệ thuật",
      description: "Bạn là Tế tư / Học giả tối cao dẫn dắt thời kỳ phát triển văn minh rực rỡ. Kinh tế xã hội đầy đủ, đời sống vật chất dư dả. Nhu cầu tinh thần và ý thức xã hội bắt đầu phân hóa sâu sắc. Hãy đưa ra các quyết định văn hóa để kiến tạo văn minh!",
      images: {
        title: "/game/chapter3_title.jpg",
        options: "/game/chapter3_options.jpg",
        good: "/game/chapter3_good.jpg",
        bad: "/game/chapter3_bad.jpg"
      },
      choices: {
        A: {
          id: "A",
          title: "Phát triển tôn giáo, giáo dục",
          hasBakedText: true,
          good: {
            title: "Văn Minh Khai Sáng!",
            text: "", // Baked in image: "Nhân dân được học hành đầy đủ, tôn giáo bắt đầu được phát triển hướng con người tới những điều thiện hơn. Xã hội phát triển văn minh và tri thức hơn"
            image: "/game/chapter3_good.jpg",
            effect: "Trình độ văn minh nâng cao, giáo dục lan rộng (+20 Điểm Văn Minh)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Mâu Thuẫn Tôn Giáo!",
            text: "", // Baked in image: "Mặc dù được giáo dục đầy đủ, nhưng việc xuất hiện nhiều các tôn giáo khác nhau gây mâu thuẫn sâu sắc trong cộng đồng khiến xã hội bắt đầu chia rẽ, xuất hiện bạo động và xảy ra chiến tranh tôn giáo"
            image: "/game/chapter3_bad.jpg",
            effect: "Mâu thuẫn sâu sắc dẫn đến chia rẽ bộ tộc và bạo lực (-20 Điểm Đoàn Kết)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        B: {
          id: "B",
          title: "Phát triển văn hóa, nghệ thuật",
          hasBakedText: true, // Now B has baked text
          good: {
            title: "Khai Sáng Nghệ Thuật!",
            text: "", // Baked in image: "Sự xuất hiện của văn hóa nghệ thuật giúp nhân dân cải thiện và nâng cao đời sống tinh thần và sự đoàn kết. Năng suất lao động tăng, xã hội phát triển"
            image: "/game/chapter3_b_good.jpg",
            effect: "Nâng cao đời sống tinh thần và đoàn kết bộ lạc (+15 Điểm Văn Minh)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Mơ Tưởng Hưởng Lạc!",
            text: "", // Baked in image: "Nhân dân bắt đầu tập trung quá mức vào nghệ thuật và tinh thần, bỏ bê cuộc sống vật chất, năng suất lao động giảm mạnh, kinh tế bắt đầu suy tàn, con người chỉ còn sống trong mơ tưởng hơn là thực tế"
            image: "/game/chapter3_b_bad.jpg",
            effect: "Bỏ bê vật chất, năng lượng sản xuất đình trệ suy tàn (-15 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        C: {
          id: "C",
          title: "Phát triển khoa học",
          hasBakedText: true, // Now C has baked text
          good: {
            title: "Khai Phá Kỹ Thuật!",
            text: "", // Baked in image: "Con người bắt đầu phát triển khoa học, công nghệ phát triển mạnh giải quyết được nhiều vấn đề, kinh tế đi lên, xã hội phát triển"
            image: "/game/chapter3_c_good.jpg",
            effect: "Giải quyết nhiều vấn đề thực tế, kinh tế đi lên (+25 Điểm Công Nghệ)",
            overlay: "rgba(46, 204, 113, 0.05)"
          },
          bad: {
            title: "Robot Nô Dịch!",
            text: "", // Baked in image: "Khoa học phát triển mất kiểm soát, các sản phẩm khoa học bắt đầu thay thế và nô lệ hóa con người, tạo ra một xã hội robot, nơi mà robot kiểm soát toàn bộ và nô dịch con người"
            image: "/game/chapter3_c_bad.jpg",
            effect: "Phát triển khoa học mất kiểm soát, robot chiếm hữu quyền thống trị (-25 Điểm Trí Thức)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        },
        D: {
          id: "D",
          title: "Không làm gì cả",
          hasBakedText: true, // Now D has baked text
          singleOutcome: "bad", // 100% fail!
          bad: {
            title: "Xã Hội Sụp Đổ!",
            text: "", // Baked in image: "Xã hội sụp đổ do ngừng lao động"
            image: "/game/chapter3_d_bad.jpg",
            effect: "Ngừng sản xuất vật chất là tự sát, xã hội sụp đổ hoàn toàn (-50 Điểm Sinh Tồn)",
            overlay: "rgba(231, 76, 60, 0.05)"
          }
        }
      }
    }
  };

  const activeChapterData = chapters[currentChapter];
  const currentChoiceData = selectedChoice ? activeChapterData.choices[selectedChoice] : null;

  const suspenseMessages = [
    "Gió tuyết gầm rú bên ngoài...",
    "Định mệnh đang xoay vần trong bóng đêm...",
    "Bộ tộc đang nín thở chờ kết quả...",
    "Quan hệ sản xuất mới đang được hình thành..."
  ];

  const handleSelectOption = (choiceKey) => {
    setSelectedChoice(choiceKey);
    setGameState('suspense');

    const choiceData = activeChapterData.choices[choiceKey];
    
    // Hidden flip calculation
    let finalResult = 'good';
    if (choiceData.singleOutcome) {
      finalResult = choiceData.singleOutcome;
    } else {
      const outcomes = ['good', 'bad'];
      finalResult = outcomes[Math.floor(Math.random() * outcomes.length)];
    }
    setCoinResult(finalResult);

    // Rotate suspense texts
    let textIndex = 0;
    setSuspenseText(suspenseMessages[0]);
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % suspenseMessages.length;
      setSuspenseText(suspenseMessages[textIndex]);
    }, 450);

    // Suspense delay
    setTimeout(() => {
      clearInterval(textInterval);
      setGameState('result');
      
      // Save play history
      setHistory(prev => [
        {
          chapter: `Chương ${currentChapter}`,
          choice: choiceData.title,
          result: finalResult === 'good' ? 'Tốt' : 'Xấu',
          text: finalResult === 'good' ? choiceData.good.title : (choiceData.bad ? choiceData.bad.title : '')
        },
        ...prev
      ]);

      // Sequential progression: Auto-unlock next chapter
      const nextChapterId = currentChapter + 1;
      if (chapters[nextChapterId]) {
        const maxUnlocked = Math.max(
          parseInt(localStorage.getItem('max_unlocked_chapter') || '1'),
          nextChapterId
        );
        localStorage.setItem('max_unlocked_chapter', maxUnlocked.toString());
        setUnlockedChapters(prev => prev.includes(nextChapterId) ? prev : [...prev, nextChapterId]);
      }
    }, 1800);
  };

  const selectChapter = (chapterId) => {
    if (!unlockedChapters.includes(chapterId)) {
      alert(`Chương ${chapterId} đang khóa! Hãy hoàn thành chương trước đó để tiếp tục cuộc tiến hóa từ thời nguyên thủy đến hiện đại.`);
      return;
    }
    setCurrentChapter(chapterId);
    setGameState('intro');
    setSelectedChoice(null);
    setCoinResult(null);
  };

  const startDecision = () => {
    setGameState('choice');
  };

  const resetGame = () => {
    setGameState('chapter_select');
    setSelectedChoice(null);
    setCoinResult(null);
    setHistory([]);
  };

  const chooseAnother = () => {
    setGameState('choice');
    setSelectedChoice(null);
    setCoinResult(null);
  };

  const resetProgress = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại toàn bộ tiến trình chơi? Các chương sau sẽ bị khóa lại.")) {
      localStorage.removeItem('max_unlocked_chapter');
      setUnlockedChapters([1]);
      setHistory([]);
      alert("Đã đặt lại tiến trình chơi thành công! Các chương đã khóa lại.");
    }
  };

  return (
    <main className="adventure-game-shell">
      {/* Dynamic Scoped CSS for standard 16:9 canvas game */}
      <style>{`
        .adventure-game-shell {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 10px 20px 30px;
          font-family: var(--font-body);
          color: var(--text-dark);
        }

        .game-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          background: var(--bg-cream);
          border: 2px solid var(--primary-black);
          padding: 12px 20px;
        }

        .game-top-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-grey);
          letter-spacing: 0.5px;
        }

        .game-top-title strong {
          color: var(--text-dark);
        }

        .game-console-canvas {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background-color: var(--bg-white);
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 2px var(--primary-black);
          background-size: cover;
          background-position: center;
          transition: all 0.3s ease;
        }

        .console-screen {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background-size: cover;
          background-position: center;
        }

        .screen-darken {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
          z-index: 1;
        }

        .chapter-select-screen {
          background: var(--bg-cream);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          box-sizing: border-box;
        }

        .chapter-select-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .chapter-select-header h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: var(--primary-black);
          letter-spacing: 1px;
          font-family: var(--font-heading);
        }

        .chapter-select-header p {
          font-size: 0.9rem;
          color: var(--text-grey);
          margin: 0;
        }

        .chapter-cards-grid {
          display: flex;
          gap: 30px;
          width: 100%;
          max-width: 800px;
          justify-content: center;
        }

        .chapter-card-btn {
          flex: 1;
          max-width: 360px;
          background: var(--bg-white);
          border: 2px solid var(--primary-black);
          padding: 25px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 200px;
          box-sizing: border-box;
        }

        .chapter-card-btn:hover:not(.locked) {
          background: var(--bg-cream);
          border-color: var(--primary-red);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(168, 0, 0, 0.15);
        }

        .chapter-card-btn.locked {
          opacity: 0.5;
          filter: grayscale(80%);
          cursor: not-allowed;
          border-color: var(--border-grey);
        }

        .chapter-card-btn.locked:hover {
          transform: none;
          box-shadow: none;
          background: var(--bg-white);
          border-color: var(--border-grey);
        }

        .chapter-card-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-red);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
          display: block;
          font-family: var(--font-heading);
        }

        .chapter-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0 0 8px 0;
          line-height: 1.3;
          font-family: var(--font-heading);
        }

        .chapter-card-desc {
          font-size: 0.8rem;
          color: var(--text-grey);
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .chapter-card-footer {
          margin-top: 15px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-red);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
        }

        .intro-overlay-panel {
          position: absolute;
          bottom: 8%;
          left: 5%;
          right: 5%;
          z-index: 2;
          background: var(--bg-white);
          border: 2px solid var(--primary-black);
          padding: 20px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .intro-text-block {
          max-width: 70%;
        }

        .intro-text-block h3 {
          font-size: 1.15rem;
          color: var(--primary-red);
          font-weight: 700;
          margin: 0 0 6px 0;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: var(--font-heading);
        }

        .intro-text-block p {
          font-size: 0.85rem;
          color: var(--text-grey);
          line-height: 1.4;
          margin: 0;
        }

        .btn-console {
          background: var(--primary-red);
          color: #fff;
          border: 2px solid var(--primary-black);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          padding: 12px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(168, 0, 0, 0.3);
          white-space: nowrap;
        }

        .btn-console:hover {
          background: var(--hover-red);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(168, 0, 0, 0.4);
        }

        .choice-grid {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 33.33%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 0;
          z-index: 3;
        }
        .choice-grid-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 4px;
          position: relative;
          font-family: var(--font-heading);
        }
        .choice-grid-btn .choice-grid-label,
        .choice-grid-btn .choice-grid-title {
          display: none;
        }
        .choice-grid-btn:hover {
          background: rgba(168,0,0,0.15);
          box-shadow: inset 0 0 20px rgba(168,0,0,0.1);
        }
        .choice-grid-btn:hover .choice-grid-label {
          display: flex;
        }
        .choice-grid-btn:hover .choice-grid-title {
          display: block;
        }
        .choice-grid-label {
          font-size: 1.2rem;
          font-weight: 900;
          background: rgba(168,0,0,0.3);
          border: 2px solid rgba(255,255,255,0.5);
          width: 36px;
          height: 36px;
          border-radius: 4px;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-shadow: 0 2px 6px rgba(0,0,0,0.7);
        }
        .choice-grid-title {
          font-size: 0.75rem;
          color: #fff;
          font-weight: 700;
          text-shadow: 0 2px 6px rgba(0,0,0,0.7);
        }

        .suspense-screen {
          background: var(--bg-cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }

        .coin-flip-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 20px;
        }

        .coin {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -45px;
          margin-top: -45px;
          transform-style: preserve-3d;
          border: 2px solid var(--primary-black);
        }

        .coin.flipping {
          animation: coinFlip 1.6s ease-in-out forwards;
        }

        .coin.good {
          background: radial-gradient(circle at 35% 35%, #fff, #10b981);
          border-color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        .coin.bad {
          background: radial-gradient(circle at 35% 35%, #fff, #dc2626);
          border-color: #dc2626;
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
        }

        .coin-face {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 900;
          backface-visibility: hidden;
          font-family: var(--font-heading);
        }

        .coin-face.front {
          background: var(--bg-cream);
          border: 3px solid var(--primary-black);
          color: var(--primary-red);
        }

        .coin-face.back {
          background: var(--bg-cream);
          border: 3px solid var(--primary-black);
          color: var(--primary-red);
          transform: rotateY(180deg);
        }

        @keyframes coinFlip {
          0% { transform: rotateY(0deg) scale(1); }
          20% { transform: rotateY(180deg) scale(1.1); }
          40% { transform: rotateY(360deg) scale(0.95); }
          60% { transform: rotateY(540deg) scale(1.05); }
          80% { transform: rotateY(720deg) scale(0.98); }
          100% { transform: rotateY(720deg) scale(1); }
        }

        .suspense-caption-title {
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 10px;
          text-transform: uppercase;
          color: var(--primary-black);
          font-family: var(--font-heading);
        }

        .suspense-caption-body {
          font-size: 0.95rem;
          color: var(--text-grey);
          font-style: italic;
          height: 25px;
        }

        .novel-textbox {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          background: var(--bg-white);
          border-top: 3px solid var(--primary-black);
          padding: 22px 30px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .novel-textbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .novel-textbox-title {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
          font-family: var(--font-heading);
        }

        .novel-textbox-title.good { color: #10b981; }
        .novel-textbox-title.bad { color: #dc2626; }

        .novel-textbox-desc {
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--text-grey);
          margin: 0;
        }

        .novel-textbox-effect {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 8px 12px;
          background: var(--bg-cream);
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--border-grey);
        }

        .novel-textbox-effect.good {
          color: #10b981;
          border-left: 4px solid #10b981;
        }

        .novel-textbox-effect.bad {
          color: #dc2626;
          border-left: 4px solid #dc2626;
        }

        .novel-floating-actions {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 5;
          display: flex;
          gap: 10px;
        }

        .btn-novel-small {
          background: var(--bg-white);
          border: 2px solid var(--primary-black);
          color: var(--text-dark);
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-heading);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .btn-novel-small:hover {
          background: var(--primary-red);
          border-color: var(--primary-red);
          color: #fff;
          transform: translateY(-1px);
        }

        .console-footer-instructions {
          margin-top: 20px;
          background: var(--bg-cream);
          border: 2px solid var(--primary-black);
          padding: 15px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-console-back {
          background: transparent;
          border: 2px solid var(--primary-black);
          color: var(--text-grey);
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-heading);
        }

        .btn-console-back:hover {
          background: var(--primary-black);
          color: var(--bg-cream);
        }

        .novel-history-box {
          margin-top: 20px;
          background: var(--bg-cream);
          border: 2px solid var(--primary-black);
          padding: 15px 20px;
        }

        .novel-history-box h4 {
          font-size: 0.95rem;
          margin: 0 0 10px 0;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: var(--font-heading);
        }

        .history-mini-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .history-mini-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          padding: 6px 10px;
          background: var(--bg-white);
          border: 1px solid var(--border-grey);
        }

        .outcome-badge {
          position: absolute;
          z-index: 5;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 6px 14px;
          border: 2px solid var(--primary-black);
        }

        .outcome-badge.good {
          background: rgba(16, 185, 129, 0.9);
          color: #fff;
        }

        .outcome-badge.bad {
          background: rgba(220, 38, 38, 0.9);
          color: #fff;
        }
      `}</style>

      {/* Top Bar Status */}
      <div className="game-top-bar">
        <span className="game-top-title">
          GAME TƯƠNG TÁC: {gameState !== 'chapter_select' ? <strong>{activeChapterData.title}</strong> : <strong>Bản Đồ Lịch Sử</strong>}
        </span>
        {gameState !== 'chapter_select' && (
          <button type="button" className="btn-console-back" onClick={resetGame}>
            Đổi Chương Chơi
          </button>
        )}
        <button type="button" className="btn-console-back" onClick={onBack}>
          Quay lại bài học
        </button>
      </div>

      {/* 16:9 Interactive Console Game Board */}
      <div className="game-console-canvas">
        
        {/* ================= SCREEN 0: CHAPTER SELECTOR ================= */}
        {gameState === 'chapter_select' && (
          <div className="console-screen chapter-select-screen">
            <div className="chapter-select-header" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
              <h2>CHỌN CHƯƠNG LỊCH SỬ</h2>
              <p style={{ marginBottom: '8px' }}>Trải nghiệm các quy luật hình thái kinh tế - xã hội qua nhập vai tương tác</p>
              
              <button 
                type="button" 
                onClick={resetProgress}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ff8888',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Đặt Lại Tiến Trình (Khóa các Chương)
              </button>
            </div>
            <div className="chapter-cards-grid">
              {Object.keys(chapters).map((key) => {
                const chap = chapters[key];
                const isUnlocked = unlockedChapters.includes(chap.id);
                return (
                  <div 
                    key={key} 
                    className={`chapter-card-btn ${isUnlocked ? 'unlocked' : 'locked'}`}
                    onClick={() => selectChapter(chap.id)}
                  >
                    <div>
                      <span className="chapter-card-badge">Chương {chap.id}</span>
                      <h3 className="chapter-card-title">
                        {chap.id === 1 
                          ? "Nguyên Thủy: Bầy người & Săn bắt hái lượm" 
                          : chap.id === 2 
                          ? "Thị Tộc: Lực lượng sản xuất & Tư hữu" 
                          : "Văn Minh: Ý thức xã hội & Phát triển"}
                      </h3>
                      <p className="chapter-card-desc">{chap.description}</p>
                    </div>
                    <div className="chapter-card-footer">
                      {isUnlocked ? (
                        <>CHƠI NGAY &rarr;</>
                      ) : (
                        <>KHÓA (Yêu cầu Chương {chap.id - 1})</>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SCREEN 1: INTRO SCREEN ================= */}
        {gameState === 'intro' && activeChapterData && (
          <div 
            className="console-screen" 
            style={{ backgroundImage: `url(${activeChapterData.images.title})` }}
          >
            <div className="screen-darken" />
            <div className="intro-overlay-panel">
              <div className="intro-text-block">
                <h3>{activeChapterData.title}</h3>
                <p>{activeChapterData.description}</p>
              </div>
              <button type="button" className="btn-console" onClick={startDecision}>
                BẮT ĐẦU CHƠI
              </button>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: CHOICE SCREEN (2x2 GRID) ================= */}
        {gameState === 'choice' && activeChapterData && (
          <div 
            className="console-screen" 
            style={{ backgroundImage: `url(${activeChapterData.images.options})` }}
          >
            <div className="choice-grid">
              {Object.keys(activeChapterData.choices).map((key, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                const c = activeChapterData.choices[key];
                return (
                  <button key={key} type="button" className="choice-grid-btn" onClick={() => handleSelectOption(key)}>
                    <span className="choice-grid-label">{label}</span>
                    <span className="choice-grid-title">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: SUSPENSE SCREEN ================= */}
        {gameState === 'suspense' && currentChoiceData && (
          <div className="console-screen suspense-screen">
            <div className="coin-flip-container">
              <div className={`coin flipping`}>
                <div className="coin-face front">★</div>
                <div className="coin-face back">●</div>
              </div>
            </div>
            
            <div className="suspense-caption-title">ĐỊNH MỆNH ĐANG ĐƯỢC QUYẾT ĐỊNH...</div>
            <div className="suspense-caption-body">{suspenseText}</div>
            
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666666', maxWidth: '350px' }}>
              Quyết định <strong>"{currentChoiceData.title}"</strong> đang chịu tác động của quy luật tự nhiên và lịch sử...
            </p>
          </div>
        )}

        {/* ================= SCREEN 4: RESULT SCREEN ================= */}
        {gameState === 'result' && currentChoiceData && coinResult && (
          <div 
            className="console-screen" 
            style={{ 
              backgroundImage: `url(${coinResult === 'good' ? currentChoiceData.good.image : currentChoiceData.bad.image})` 
            }}
          >
            <div className="screen-darken" />
            
            {/* Badge telling result */}
            <span 
              className={`outcome-badge ${coinResult}`} 
              style={{ top: '20px', left: '20px' }}
            >
              {coinResult === 'good' ? '★ KẾT CỤC TỐT' : '● KẾT CỤC XẤU'}
            </span>

            {/* Coin result visual */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '200px',
              zIndex: 5,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: coinResult === 'good'
                ? 'radial-gradient(circle at 35% 35%, #fff, #10b981)'
                : 'radial-gradient(circle at 35% 35%, #fff, #dc2626)',
              border: '2px solid var(--primary-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: '900',
              color: coinResult === 'good' ? '#065f46' : '#7f1d1d',
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {coinResult === 'good' ? '★' : '●'}
            </div>

            {/* Visual Novel style Textbox at the bottom of the screen */}
            <div className="novel-textbox" style={{ zIndex: 10 }}>
              <div className="novel-textbox-header">
                <h3 className={`novel-textbox-title ${coinResult}`}>
                  {coinResult === 'good' ? currentChoiceData.good.title : currentChoiceData.bad.title}
                </h3>
              </div>
              
              <div className={`novel-textbox-effect ${coinResult}`} style={{ margin: 0 }}>
                <span>⚖️ <strong>Ảnh hưởng:</strong> {coinResult === 'good' ? currentChoiceData.good.effect : currentChoiceData.bad.effect}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-novel-small" onClick={chooseAnother}>
                  CHỌN LẠI GẦN NHẤT
                </button>
                <button type="button" className="btn-novel-small" onClick={resetGame}>
                  CHỌN CHƯƠNG KHÁC
                </button>
                {chapters[currentChapter + 1] && (
                  <button 
                    type="button" 
                    className="btn-novel-small" 
                    onClick={() => selectChapter(currentChapter + 1)}
                    style={{
                      background: 'var(--primary-red)',
                      color: '#ffffff',
                      borderColor: 'var(--primary-red)',
                      fontWeight: '800'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--hover-red)';
                      e.target.style.borderColor = 'var(--hover-red)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'var(--primary-red)';
                      e.target.style.borderColor = 'var(--primary-red)';
                    }}
                  >
                    KẾ TIẾP (CHƯƠNG {currentChapter + 1}) &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info & History panel below the console board */}
      <div className="console-footer-instructions">
        <span style={{ fontSize: '0.85rem', color: '#666666' }}>
          <em>Mẹo: Hoàn thành mỗi chương để mở khóa chương kế tiếp.</em>
        </span>
        <button type="button" className="btn-console-back" onClick={resetGame}>
          Chọn chương chơi
        </button>
      </div>

      {/* Decision play history list */}
      {history.length > 0 && (
        <div className="novel-history-box">
          <h4>Lịch sử các quyết định của bạn:</h4>
          <div className="history-mini-list">
            {history.map((item, index) => (
              <div key={index} className="history-mini-item">
                <span>
                  <strong>{item.chapter}</strong> - <strong>{item.choice}</strong> &rarr; <span style={{ color: '#aaaaaa' }}>{item.text}</span>
                </span>
                <span style={{ color: item.result === 'Tốt' ? '#10b981' : '#dc2626', fontWeight: '700' }}>
                  {item.result === 'Tốt' ? 'Tốt' : 'Xấu'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
