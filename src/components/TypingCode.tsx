import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

const TypingCode = ({ width = "500px", height = "560px", minHeight = "500px" }) => {
  const typedRef = useRef(null);
  const terminalRef = useRef(null);
  const [startTerminalTyping, setStartTerminalTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState(1);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        `<span class="token-tag">&lt;div</span> <span class="token-attr">className</span>=<span class="token-string">"col-span-3"</span><span class="token-tag">&gt;</span>
  <span class="token-tag">&lt;h2</span> <span class="token-attr">className</span>=<span class="token-string">"mb-4 text-lg font-bold"</span><span class="token-tag">&gt;</span>
    BIOGRAPHY
  <span class="token-tag">&lt;/h2&gt;</span>
  <span class="token-tag">&lt;p</span> <span class="token-attr">className</span>=<span class="token-string">"font-medium"</span><span class="token-tag">&gt;</span>
    Web Developer who is experienced in building 
    responsive and engaging web applications. 
    Skilled in implementing UI/UX designs into 
    clean and efficient code.
  <span class="token-tag">&lt;/p&gt;</span>
  <span class="token-tag">&lt;p</span> <span class="token-attr">className</span>=<span class="token-string">"my-4 font-medium"</span><span class="token-tag">&gt;</span>
    P.s I like playing music and sports✌️.
  <span class="token-tag">&lt;/p&gt;</span>
<span class="token-tag">&lt;/div&gt;</span>`
      ],
      typeSpeed: 20,
      showCursor: true,
      cursorChar: "|",
      loop: false,
      contentType: "html",
      onStringTyped: () => {
        const content = typedRef.current?.textContent || '';
        const lines = content.split('\n').length;
        setCurrentLine(lines);
      },
      onComplete: () => {
        setTimeout(() => setStartTerminalTyping(true), 500);
      }
    });

    // Update current line during typing
    const interval = setInterval(() => {
      if (typedRef.current) {
        const content = typedRef.current.textContent || '';
        const lines = content.split('\n').length;
        setCurrentLine(lines);
      }
    }, 50);

    return () => {
      typed.destroy();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (startTerminalTyping && terminalRef.current) {
      const terminalTyped = new Typed(terminalRef.current, {
        strings: ["npm run dev"],
        typeSpeed: 80,
        showCursor: true,
        cursorChar: "_",
        loop: false
      });

      return () => terminalTyped.destroy();
    }
  }, [startTerminalTyping]);

  return (
    <div className="w-full">
      {/* VS Code Window */}
      <div 
        className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-[#333] md:text-xs"
        style={{ width: '100%', maxWidth: width, minHeight }}
      >
        {/* Header dengan tombol macOS */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 border-b border-[#333] md:px-3 md:py-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] md:w-2 md:h-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] md:w-2 md:h-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] md:w-2 md:h-2"></div>
          <span className="ml-3 text-[#cccccc] text-sm font-mono md:text-xs md:ml-2">
            about.js
          </span>
        </div>

        {/* Code Editor */}
        <div className="flex border-b border-[#333]">
          {/* Line Numbers */}
          <div className="bg-[#1e1e1e] text-[#858585] text-right py-6 px-4 select-none font-mono text-sm leading-6 border-r border-[#333] md:px-2 md:py-4 md:text-xs md:leading-5">
            <div className={currentLine === 1 ? "text-[#cccccc]" : ""}>1</div>
            <div className={currentLine === 2 ? "text-[#cccccc]" : ""}>2</div>
            <div className={currentLine === 3 ? "text-[#cccccc]" : ""}>3</div>
            <div className={currentLine === 4 ? "text-[#cccccc]" : ""}>4</div>
            <div className={currentLine === 5 ? "text-[#cccccc]" : ""}>5</div>
            <div className={currentLine === 6 ? "text-[#cccccc]" : ""}>6</div>
            <div className={currentLine === 7 ? "text-[#cccccc]" : ""}>7</div>
            <div className={currentLine === 8 ? "text-[#cccccc]" : ""}>8</div>
            <div className={currentLine === 9 ? "text-[#cccccc]" : ""}>9</div>
            <div className={currentLine === 10 ? "text-[#cccccc]" : ""}>10</div>
            <div className={currentLine === 11 ? "text-[#cccccc]" : ""}>11</div>
            <div className={currentLine === 12 ? "text-[#cccccc]" : ""}>12</div>
            <div className={currentLine === 13 ? "text-[#cccccc]" : ""}>13</div>
            <div className={currentLine === 14 ? "text-[#cccccc]" : ""}>14</div>
            <div className={currentLine === 15 ? "text-[#cccccc]" : ""}>15</div>
            <div className={currentLine === 16 ? "text-[#cccccc]" : ""}>16</div>
          </div>

          {/* Code Content */}
          <div className="flex-1 py-6 pr-6 font-mono text-sm leading-6 text-[#d4d4d4] overflow-x-auto relative code-syntax md:py-4 md:pr-3 md:text-xs md:leading-5">
            <div 
              className="absolute left-0 right-0 bg-[#2a2d2e] transition-all duration-100 pointer-events-none"
              style={{ 
                top: `${(currentLine - 1) * 24 + 24}px`, 
                height: '24px' 
              }}
            />
            <pre className="whitespace-pre relative z-10">
              <span ref={typedRef}></span>
            </pre>
          </div>
        </div>

        {/* Terminal */}
        <div className="bg-[#1e1e1e] border-t border-[#333]">
          <div className="px-4 py-2 text-[#858585] text-xs font-mono border-b border-[#333]/50 flex gap-4 md:px-3 md:py-1.5 md:gap-2">
            <span className="md:text-[10px]">PROBLEMS</span>
            <span className="text-[#cccccc] md:text-[10px]">TERMINAL</span>
            <span className="md:text-[10px]">OUTPUT</span>
          </div>
          <div className="p-4 font-mono text-sm text-[#d4d4d4] md:p-3 md:text-xs">
            <span className="text-[#4ec9b0]">PS C:\yoelgntng&gt;</span>{" "}
            <span ref={terminalRef}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingCode;
