import { User } from "@/types/post";

interface PillProps extends User {}

const Pill = ({ sex, mbti, age, job }: PillProps) => (
    <ul className="flex flex-row gap-1">
        {[sex, mbti, age, job].map((item, idx) => (
        <li
            key={idx}
            className="text-main text-center text-[10px] rounded-full border border-main py-0.5 px-2 min-w-[60px]"
        >
            {item}
        </li>
        ))}
    </ul>
)

export default Pill;