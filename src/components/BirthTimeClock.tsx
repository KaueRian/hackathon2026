"use client";

import { useCallback, useMemo, useRef } from "react";

type TimeValue = {
    hours: number;
    minutes: number;
};

type BirthTimeClockProps = {
    value: string;
    onChange: (value: string) => void;
};

type LinearScale = ((input: number) => number) & {
    invert: (output: number) => number;
};

const clockStyle = {
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    border: "10px solid #111827",
    position: "relative",
    margin: "24px auto 0",
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
    background:
        "radial-gradient(circle at 50% 40%, #ffffff 0%, #f8fafc 62%, #eef2ff 100%)",
    userSelect: "none",
    touchAction: "none",
} as const;

const centerPointStyle = {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
} as const;

const handStyle = {
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    borderRadius: "999px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
} as const;

const handleStyle = {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#111827",
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    cursor: "grab",
    border: "2px solid #fff",
    zIndex: 15,
    touchAction: "none",
} as const;

function parseTime(value: string): TimeValue {
    const [hourPart, minutePart] = value.split(":");
    const parsedHours = Number.parseInt(hourPart ?? "", 10);
    const parsedMinutes = Number.parseInt(minutePart ?? "", 10);

    if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
        return { hours: 10, minutes: 10 };
    }

    return {
        hours: ((parsedHours % 12) + 12) % 12,
        minutes: Math.max(0, Math.min(59, parsedMinutes)),
    };
}

function formatTime(hours: number, minutes: number) {
    const displayHours = hours === 0 ? 12 : hours;
    return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function createLinearScale(domainStart: number, domainEnd: number, rangeStart: number, rangeEnd: number): LinearScale {
    const domainSpan = domainEnd - domainStart;
    const rangeSpan = rangeEnd - rangeStart;

    const scale = ((input: number) => rangeStart + ((input - domainStart) / domainSpan) * rangeSpan) as LinearScale;
    scale.invert = (output: number) => domainStart + ((output - rangeStart) / rangeSpan) * domainSpan;
    return scale;
}

export default function BirthTimeClock({ value, onChange }: BirthTimeClockProps) {
    const clockRef = useRef<HTMLDivElement>(null);

    const minuteScale = useMemo(() => createLinearScale(0, 60, 0, 360), []);
    const hourScale = useMemo(() => createLinearScale(0, 12, 0, 360), []);

    const { hours, minutes } = parseTime(value);

    const minuteAngle = minuteScale(minutes);
    const hourAngle = hourScale(hours % 12) + (minutes / 60) * 30;

    const calculateAngleFromPoint = useCallback((clientX: number, clientY: number) => {
        if (!clockRef.current) return 0;

        const rect = clockRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        const angleRad = Math.atan2(deltaY, deltaX);
        let angleDeg = (angleRad * 180) / Math.PI;

        angleDeg = (angleDeg + 90 + 360) % 360;
        return angleDeg;
    }, []);

    const updateTime = useCallback(
        (nextHours: number, nextMinutes: number) => {
            onChange(formatTime(nextHours, nextMinutes));
        },
        [onChange],
    );

    const handleDragStart = useCallback(
        (type: "hour" | "minute", startEvent: React.PointerEvent<HTMLDivElement>) => {
            startEvent.preventDefault();

            const pointerId = startEvent.pointerId;
            const onMove = (moveEvent: PointerEvent) => {
                if (moveEvent.pointerId !== pointerId) return;

                const angle = calculateAngleFromPoint(moveEvent.clientX, moveEvent.clientY);
                const currentTime = parseTime(value);

                if (type === "minute") {
                    const nextMinutes = Math.round(minuteScale.invert(angle)) % 60;
                    updateTime(currentTime.hours, nextMinutes < 0 ? nextMinutes + 60 : nextMinutes);
                    return;
                }

                const hourAngleOnly = angle - (currentTime.minutes / 60) * 30;
                let nextHours = Math.round(hourScale.invert(hourAngleOnly));
                nextHours = (nextHours + 12) % 12;
                updateTime(nextHours, currentTime.minutes);
            };

            const onUp = (endEvent: PointerEvent) => {
                if (endEvent.pointerId !== pointerId) return;
                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
                document.removeEventListener("pointercancel", onUp);
            };

            document.addEventListener("pointermove", onMove);
            document.addEventListener("pointerup", onUp);
            document.addEventListener("pointercancel", onUp);
        },
        [calculateAngleFromPoint, hourScale, minuteScale, updateTime, value],
    );

    return (
        <div className="rounded-[2rem] border-4 border-black bg-[#fff6e8] p-4 sm:p-6 shadow-[10px_10px_0_#000]">
            <div className="text-center">
                <label className="block text-xl font-black uppercase tracking-tight text-black">
                    Hora de Nascimento *
                </label>
                <p className="mt-1 text-xs text-black/60">
                    Arraste as pontas dos ponteiros para montar a hora. O relógio não julga, mas o formulário sim.
                </p>
            </div>

            <div className="mt-4 text-center text-3xl font-black font-mono text-black">
                {formatTime(hours, minutes)}
            </div>

            <div ref={clockRef} style={clockStyle}>
                <div style={centerPointStyle} />

                {[...Array(12)].map((_, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            width: index % 3 === 0 ? "4px" : "2px",
                            height: index % 3 === 0 ? "18px" : "12px",
                            backgroundColor: "#111827",
                            top: "8px",
                            left: "50%",
                            transformOrigin: `50% ${142}px`,
                            transform: `translateX(-50%) rotate(${index * 30}deg)`,
                        }}
                    />
                ))}

                <div
                    id="hour-hand"
                    style={{
                        ...handStyle,
                        width: "8px",
                        height: "76px",
                        backgroundColor: "#111827",
                        transform: `translateX(-50%) rotate(${hourAngle}deg)`,
                        zIndex: 5,
                    }}
                >
                    <div
                        className="hour-handle"
                        style={{ ...handleStyle, backgroundColor: "#c0392b" }}
                        onPointerDown={(e) => handleDragStart("hour", e)}
                    />
                </div>

                <div
                    id="minute-hand"
                    style={{
                        ...handStyle,
                        width: "4px",
                        height: "118px",
                        backgroundColor: "#4b5563",
                        transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
                        zIndex: 4,
                    }}
                >
                    <div
                        className="minute-handle"
                        style={{ ...handleStyle, backgroundColor: "#2563eb" }}
                        onPointerDown={(e) => handleDragStart("minute", e)}
                    />
                </div>
            </div>
        </div>
    );
}