import { UserCategory } from "@/types/post";

interface PillProps extends UserCategory {}

const Pill = ({ gender, mbti, age, occupation }: PillProps) => (
    <ul className="flex flex-row gap-1">
        {[gender, mbti, age, occupation].map((item, idx) => (
        <li
            key={idx}
            className="text-main text-center text-[10px] rounded-full border border-main py-0.5 w-[60px]"
        >
            {item}
        </li>
        ))}
    </ul>
)

export default Pill;