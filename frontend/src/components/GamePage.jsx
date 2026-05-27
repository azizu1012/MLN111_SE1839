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
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #ffffff;
        }

        /* Top Header Info */
        .game-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 20px;
          border-radius: 8px;
        }

        .game-top-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: #aaaaaa;
          letter-spacing: 0.5px;
        }

        .game-top-title strong {
          color: #ffffff;
        }

        /* Responsive 16:9 Game Console Board */
        .game-console-canvas {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background-color: #0d0d0d;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
          background-size: cover;
          background-position: center;
          transition: all 0.3s ease;
        }

        /* Screens Layout */
        .console-screen {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background-size: cover;
          background-position: center;
        }

        /* Visual Dim Overlay */
        .screen-darken {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%);
          z-index: 1;
        }

        /* ================= CHAPTER SELECT SCREEN ================= */
        .chapter-select-screen {
          background: linear-gradient(135deg, #121212 0%, #080808 100%);
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
          color: #ffffff;
          letter-spacing: 1px;
        }

        .chapter-select-header p {
          font-size: 0.9rem;
          color: #888888;
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
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
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
          background: rgba(255, 56, 56, 0.05);
          border-color: #ff3838;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(255, 56, 56, 0.25);
        }

        .chapter-card-btn.locked {
          opacity: 0.55;
          filter: grayscale(85%) contrast(90%);
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.01);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .chapter-card-btn.locked:hover {
          background: rgba(255, 255, 255, 0.01);
          border-color: rgba(255, 255, 255, 0.05);
          transform: none;
          box-shadow: none;
        }

        .chapter-card-btn.locked .chapter-card-badge {
          color: #777777;
        }

        .chapter-card-btn.locked .chapter-card-footer {
          color: #777777;
        }

        .chapter-card-badge {
          font-size: 0.75rem;
          font-weight: 800;
          color: #ff3838;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
          display: block;
        }

        .chapter-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .chapter-card-desc {
          font-size: 0.8rem;
          color: #888888;
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
          color: #ffcc00;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ================= INTRO SCREEN OVERLAYS ================= */
        .intro-overlay-panel {
          position: absolute;
          bottom: 8%;
          left: 5%;
          right: 5%;
          z-index: 2;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 20px 25px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
          color: #ff3838;
          font-weight: 700;
          margin: 0 0 6px 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .intro-text-block p {
          font-size: 0.85rem;
          color: #cccccc;
          line-height: 1.4;
          margin: 0;
        }

        .btn-console {
          background: #ff3838;
          color: #ffffff;
          border: none;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(255, 56, 56, 0.4);
          white-space: nowrap;
        }

        .btn-console:hover {
          background: #e02424;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 56, 56, 0.6);
        }

        /* ================= CHOICE HOTSPOTS OVERLAYS ================= */
        .hotspot-button {
          position: absolute;
          z-index: 10;
          background: transparent;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hotspot-glow {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          border: 2px solid transparent;
          pointer-events: none;
          transition: all 0.2s ease;
        }

        .hotspot-button:hover {
          background: rgba(255, 56, 56, 0.08);
          border-color: rgba(255, 56, 56, 0.6);
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(255, 56, 56, 0.4);
        }

        .hotspot-button:hover .hotspot-glow {
          border-color: #ff3838;
          animation: pulseBorder 1s infinite alternate;
        }

        @keyframes pulseBorder {
          0% { box-shadow: inset 0 0 5px rgba(255,56,56,0.3); }
          100% { box-shadow: inset 0 0 15px rgba(255,56,56,0.6); }
        }

        /* Hotspot positioning exactly matching image text */
        .hotspot-A {
          top: 67%;
          left: 7%;
          width: 17%;
          height: 10%;
        }

        .hotspot-C {
          top: 81%;
          left: 7%;
          width: 28%;
          height: 10%;
        }

        .hotspot-B {
          top: 67%;
          left: 64%;
          width: 28%;
          height: 10%;
        }

        .hotspot-D {
          top: 81%;
          left: 64%;
          width: 29%;
          height: 10%;
        }

        .hotspot-guide-tip {
          position: absolute;
          top: 4%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffcc00;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          animation: pulseTip 1.5s infinite alternate;
          pointer-events: none;
        }

        @keyframes pulseTip {
          0% { transform: translate(-50%, 0) scale(0.95); opacity: 0.8; }
          100% { transform: translate(-50%, 0) scale(1.05); opacity: 1; }
        }

        /* ================= SUSPENSE SCREEN ================= */
        .suspense-screen {
          background-color: #070707;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }

        .suspense-ritual-box {
          position: relative;
          width: 90px;
          height: 90px;
          margin-bottom: 20px;
        }

        .ritual-orb {
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          background: radial-gradient(circle, #ff3838 0%, #7f0000 100%);
          box-shadow: 0 0 25px rgba(255, 56, 56, 0.7);
          animation: pulseOrb 1s infinite alternate;
        }

        .ritual-ring {
          position: absolute;
          inset: 0;
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          animation: spinInfinite 10s linear infinite;
        }

        .ritual-ring-outer {
          position: absolute;
          inset: -10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }

        @keyframes pulseOrb {
          0% { transform: scale(0.85); box-shadow: 0 0 15px rgba(255, 56, 56, 0.5); }
          100% { transform: scale(1.05); box-shadow: 0 0 35px rgba(255, 56, 56, 0.9); }
        }

        @keyframes spinInfinite {
          100% { transform: rotate(360deg); }
        }

        .suspense-caption-title {
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 10px;
          text-transform: uppercase;
          color: #ffffff;
        }

        .suspense-caption-body {
          font-size: 0.95rem;
          color: #ffb8b8;
          font-style: italic;
          height: 25px;
        }

        /* ================= RESULT SCREEN OVERLAYS ================= */
        .novel-textbox {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 80%, rgba(0, 0, 0, 0.6) 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
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

        .novel-badge {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 4px 10px;
          border-radius: 3px;
        }

        .novel-badge.good {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .novel-badge.bad {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .novel-textbox-title {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
        }

        .novel-textbox-title.good { color: #34d399; }
        .novel-textbox-title.bad { color: #f87171; }

        .novel-textbox-desc {
          font-size: 0.92rem;
          line-height: 1.5;
          color: #e2e8f0;
          margin: 0;
        }

        .novel-textbox-effect {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 4px;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .novel-textbox-effect.good {
          color: #10b981;
          border-left: 3px solid #10b981;
        }

        .novel-textbox-effect.bad {
          color: #ef4444;
          border-left: 3px solid #ef4444;
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
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255,255,255,0.25);
          color: #ffffff;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Outfit', sans-serif;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .btn-novel-small:hover {
          background: #ff3838;
          border-color: #ff3838;
          transform: translateY(-1px);
        }

        /* Info & Guide below board */
        .console-footer-instructions {
          margin-top: 20px;
          background: rgba(18, 18, 18, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 15px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-console-back {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #aaaaaa;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-console-back:hover {
          border-color: rgba(255,255,255,0.4);
          color: #ffffff;
        }

        /* History Stack styling */
        .novel-history-box {
          margin-top: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 15px 20px;
        }

        .novel-history-box h4 {
          font-size: 0.95rem;
          margin: 0 0 10px 0;
          color: #888888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          background: rgba(255,255,255,0.01);
          border-radius: 4px;
        }
      `}</style>

      {/* Top Bar Status */}
      <div className="game-top-bar">
        <span className="game-top-title">
          🎮 MÀN CHƠI TƯƠNG TÁC: {gameState !== 'chapter_select' ? <strong>{activeChapterData.title}</strong> : <strong>Bản Đồ Lịch Sử</strong>}
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
                🔄 Đặt Lại Tiến Trình (Khóa các Chương)
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
                        <>⚡ CHƠI NGAY &rarr;</>
                      ) : (
                        <>🔒 KHÓA (Yêu cầu Chương {chap.id - 1})</>
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

        {/* ================= SCREEN 2: CHOICE SCREEN (HOTSPOTS) ================= */}
        {gameState === 'choice' && activeChapterData && (
          <div 
            className="console-screen" 
            style={{ backgroundImage: `url(${activeChapterData.images.options})` }}
          >
            {/* Click direction overlay */}
            <div className="hotspot-guide-tip">
              👈 ẤN TRỰC TIẾP VÀO PHƯƠNG ÁN TRÊN HÌNH ĐỂ QUYẾT ĐỊNH 👉
            </div>

            {/* Absolute Hotspot overlays matching visual coordinates */}
            <button 
              type="button" 
              className="hotspot-button hotspot-A"
              onClick={() => handleSelectOption('A')}
              title="Lựa chọn A"
            >
              <div className="hotspot-glow" />
            </button>

            <button 
              type="button" 
              className="hotspot-button hotspot-C"
              onClick={() => handleSelectOption('C')}
              title="Lựa chọn C"
            >
              <div className="hotspot-glow" />
            </button>

            <button 
              type="button" 
              className="hotspot-button hotspot-B"
              onClick={() => handleSelectOption('B')}
              title="Lựa chọn B"
            >
              <div className="hotspot-glow" />
            </button>

            <button 
              type="button" 
              className="hotspot-button hotspot-D"
              onClick={() => handleSelectOption('D')}
              title="Lựa chọn D"
            >
              <div className="hotspot-glow" />
            </button>
          </div>
        )}

        {/* ================= SCREEN 3: SUSPENSE SCREEN ================= */}
        {gameState === 'suspense' && currentChoiceData && (
          <div className="console-screen suspense-screen">
            <div className="suspense-ritual-box">
              <div className="ritual-ring-outer" />
              <div className="ritual-ring" />
              <div className="ritual-orb" />
            </div>
            
            <div className="suspense-caption-title">Quyết định Vận Mệnh</div>
            <div className="suspense-caption-body">{suspenseText}</div>
            
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#555555', maxWidth: '350px' }}>
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
            {/* Overlay a colored filter to match the vibe */}
            <div 
              className="screen-darken"
              style={{ 
                background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)`,
                backgroundColor: coinResult === 'good' ? currentChoiceData.good.overlay : currentChoiceData.bad.overlay 
              }}
            />

            {/* floating visual novel control buttons (Top-Right) */}
            <div className="novel-floating-actions">
              <button type="button" className="btn-novel-small" onClick={chooseAnother}>
                QUYẾT ĐỊNH KHÁC
              </button>
              <button type="button" className="btn-novel-small" onClick={resetGame}>
                CHƠI LẠI
              </button>
              {chapters[currentChapter + 1] && (
                <button 
                  type="button" 
                  className="btn-novel-small" 
                  onClick={() => selectChapter(currentChapter + 1)}
                  style={{
                    background: '#ffcc00',
                    color: '#000000',
                    borderColor: '#ffcc00',
                    fontWeight: '800',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e6b800';
                    e.target.style.borderColor = '#e6b800';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffcc00';
                    e.target.style.borderColor = '#ffcc00';
                  }}
                >
                  QUA CHƯƠNG KẾ ➔
                </button>
              )}
            </div>

            {/* Badge telling result */}
            <span 
              className={`outcome-badge ${coinResult}`} 
              style={{ top: '20px', left: '20px' }}
            >
              {coinResult === 'good' ? '☀️ Kết Cục Tốt (Good)' : '⛈️ Kết Cục Xấu (Bad)'}
            </span>

            {/* Subtitle / Description Textbox at bottom */}
            <div className="novel-textbox">
              <div className="novel-textbox-header">
                <h3 className={`novel-textbox-title ${coinResult}`}>
                  {coinResult === 'good' ? currentChoiceData.good.title : currentChoiceData.bad.title}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#666666', fontStyle: 'italic' }}>
                  🪙 Lượt tung ẩn: {coinResult === 'good' ? 'MẶT TỐT (GOOD)' : 'MẶT XẤU (BAD)'}
                </span>
              </div>

              {/* Only show textbox description if there is NO baked text in the image */}
              {!currentChoiceData.hasBakedText && (
                <p className="novel-textbox-desc">
                  {coinResult === 'good' ? currentChoiceData.good.text : currentChoiceData.bad.text}
                </p>
              )}

              {/* Historical survival impact box */}
              <div className={`novel-textbox-effect ${coinResult}`}>
                <span>⚖️ <strong>Ảnh hưởng:</strong></span>
                <span>{coinResult === 'good' ? currentChoiceData.good.effect : currentChoiceData.bad.effect}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Info & History panel below the console board */}
      <div className="console-footer-instructions">
        <span style={{ fontSize: '0.85rem', color: '#888888' }}>
          💡 <em>Mẹo: Hoàn thành mỗi chương để tích lũy kinh nghiệm, mở khóa chương kế tiếp từ thời nguyên thủy đến hiện đại.</em>
        </span>
        <button type="button" className="btn-console-back" onClick={resetGame} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: '#ffffff' }}>
          Chọn chương chơi
        </button>
      </div>

      {/* Decision play history list */}
      {history.length > 0 && (
        <div className="novel-history-box">
          <h4>📜 Lịch sử các quyết định của bạn:</h4>
          <div className="history-mini-list">
            {history.map((item, index) => (
              <div key={index} className="history-mini-item">
                <span>
                  <strong>{item.chapter}</strong> - <strong>{item.choice}</strong> &rarr; <span style={{ color: '#aaaaaa' }}>{item.text}</span>
                </span>
                <span style={{ color: item.result === 'Tốt' ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                  {item.result === 'Tốt' ? '☀️ Tốt' : '⛈️ Xấu'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
