import { useEffect, useState } from 'react';

interface TypewriterProps {
    words: string[];
    className?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetweenWords?: number;
}

export function Typewriter({
    words,
    className = '',
    typingSpeed = 150,
    deletingSpeed = 100,
    delayBetweenWords = 2000,
}: TypewriterProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    // Typing
                    if (currentText.length < currentWord.length) {
                        setCurrentText(currentWord.substring(0, currentText.length + 1));
                    } else {
                        // Finished typing, wait then start deleting
                        setTimeout(() => setIsDeleting(true), delayBetweenWords);
                    }
                } else {
                    // Deleting
                    if (currentText.length > 0) {
                        setCurrentText(currentWord.substring(0, currentText.length - 1));
                    } else {
                        // Finished deleting, move to next word
                        setIsDeleting(false);
                        setCurrentWordIndex((prev) => (prev + 1) % words.length);
                    }
                }
            },
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

    return (
        <span className={className}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
}
