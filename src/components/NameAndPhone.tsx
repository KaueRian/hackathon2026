import React from 'react';

interface NameFormProps {
    numberOfLetters: number;
    selectedLetters: Record<number, string>;
    onLetterChange: (index: number, value: string) => void;
    onAddLetter: () => void;
    onRemoveLetter: () => void;
}

export default function NameAndPhoneForm({
    numberOfLetters,
    selectedLetters,
    onLetterChange,
    onAddLetter,
    onRemoveLetter,
}: NameFormProps) {

    const alfabetQwerty = "qwertyuiopåasdfghjklæøzxcvbnm";

    return (
        <div className="border-4 border-black bg-[#fff9d6] p-4 sm:p-6 shadow-[8px_8px_0_#000]">
            <label className="block text-xl font-bold mb-1 text-black">
                Nome Completo *
            </label>
            <p className="text-xs text-black/60 mb-4">
                Monte seu nome usando as letras abaixo. Quanto mais perto do caos, melhor.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: numberOfLetters }).map((_, index) => (
                    <select
                        key={index}
                        id={`letter-${index}`}
                        value={selectedLetters[index] || "-1"}
                        onChange={(e) => onLetterChange(index, e.target.value)}
                        className="min-w-14 border-4 border-black bg-white px-2 py-3 text-lg font-black uppercase outline-none transition-colors focus:border-[#ff00ea]"
                    >
                        <option value="-1"></option>
                        {alfabetQwerty.split("").map((letter, letterIdx) => (
                            <option key={letterIdx} value={letter}>
                                {letter}
                            </option>
                        ))}
                    </select>
                ))}
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onAddLetter}
                    className="border-4 border-black bg-[#00ff08] px-4 py-2 font-black uppercase text-black transition hover:bg-black hover:text-[#00ff08]"
                >
                    Adicionar letra
                </button>
                <button
                    type="button"
                    onClick={onRemoveLetter}
                    className="border-4 border-black bg-white px-4 py-2 font-black uppercase text-black transition hover:bg-black hover:text-white"
                >
                    Remover letra
                </button>
            </div>
        </div>
    );
}