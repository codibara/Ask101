import Logo from "../../../../public/new-emblem.png";
import Image from "next/image";

const LogoDesktop = () => (
    <Image
        src={Logo}
        alt="로고 이미지"
        width={40}
        height={200}
        className="hidden md:block mx-auto"
      />
)

export default LogoDesktop;