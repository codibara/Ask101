import Logo from "../../../../public/logo.png";
import Image from "next/image";

const LogoMobile = () => (
    <Image
        src={Logo}
        alt="로고 이미지"
        width={150}
        height={200}
        className="md:hidden py-5 mx-auto"
      />
)

export default LogoMobile;