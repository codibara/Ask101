import Logo from "../../../../public/mincho-new-log.png";
import Image from "next/image";

const LogoMobile = () => (
    <Image
        src={Logo}
        alt="로고 이미지"
        width={100}
        className="md:hidden py-5 mx-auto"
      />
)

export default LogoMobile;