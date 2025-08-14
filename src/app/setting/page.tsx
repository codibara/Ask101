"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BoxArrowRight, CheckCircle, Download } from "react-bootstrap-icons";

import PageHeader from "@/app/component/shared/pageHeader";
import ConfirmModal from "../component/ui/confirmModal";
import Button from "@/app/component/ui/button";

type MBTI = { 
  ei: "" | "E" | "I"; 
  sn: "" | "S" | "N"; 
  tf: "" | "T" | "F"; 
  jp: "" | "J" | "P" 
};

export default function Post() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [createdDate, setCreatedDate] = useState("");
  const [userNickName, setUserNickName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [userBirthYear, setUserBirthYear] = useState<number>();
  const [selectedMBTI, setSelectedMBTI] = useState<MBTI>({ 
    ei: "", 
    sn: "", 
    tf: "", 
    jp: "" });
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [customOccupation, setCustomOccupation] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // NEW: per-field errors
  const [errors, setErrors] = useState<{
    displayName?: string;
    sex?: string;
    birthYear?: string;
    mbti?: string;
    job?: string;
    customJob?: string;
  }>({});


  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (status === "loading") return;

      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const userData = await response.json();
          setCreatedDate(userData.registeredAtFormatted || "");
          setUserNickName(userData.displayName || "");
          setSelectedGender(userData.sex || "");
          setUserBirthYear(userData.birthYear || "");

          if (userData.customJob && userData.customJob.trim() !== "") {
            setSelectedOccupation("기타");
            setCustomOccupation(userData.customJob);
          } else {
            setSelectedOccupation(userData.job || "");
            setCustomOccupation("");
          }

          if (userData.mbti && userData.mbti.length === 4) {
            setSelectedMBTI({
              ei: userData.mbti[0],
              sn: userData.mbti[1],
              tf: userData.mbti[2],
              jp: userData.mbti[3],
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [session, status, router]);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  // Clear specific errors when the user edits that field
  const handleUserNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserNickName(value);
    
    if (errors.displayName) setErrors((p) => ({ ...p, displayName: undefined }));
  
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value.trim()) {
        const res = await fetch("/api/user/check-nickname", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: value.trim() }),
        });
        const { exists } = await res.json();
        if (exists) {
          setErrors((prev) => ({ ...prev, displayName: "이미 사용 중인 닉네임입니다." }));
        } 
      }
    }, 500);
  };

  const handleUserBirthYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 4);
    setUserBirthYear(Number(onlyNums));
    if (errors.birthYear) setErrors((p) => ({ ...p, birthYear: undefined }));
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender((prev) => (prev === gender ? "" : gender));
    if (errors.sex) setErrors((p) => ({ ...p, sex: undefined }));
  };

  const handleMBTISelect = (key: keyof MBTI, value: MBTI[typeof key]) => {
    setSelectedMBTI((prev) => {
      const next = { ...prev, [key]: prev[key] === value ? "" : value };
      if (errors.mbti) setErrors((p) => ({ ...p, mbti: undefined }));
      return next;
    });
  };

  const handleJobClick = (job: string) => {
    setSelectedOccupation((prev) => (prev === job ? "" : job));
    if (errors.job) setErrors((p) => ({ ...p, job: undefined }));
    if (errors.customJob) setErrors((p) => ({ ...p, customJob: undefined }));
  };

  const handleCustomJob = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomOccupation(e.target.value);
    setSelectedOccupation("기타");
    if (errors.customJob || errors.job) {
      setErrors((p) => ({ ...p, customJob: undefined, job: undefined }));
    }
  };

  // Helpers
  const buildMbti = (m: MBTI) =>
    m.ei && m.sn && m.tf && m.jp ? `${m.ei}${m.sn}${m.tf}${m.jp}` : null;

  const validate = () => {
    const nextErrors: typeof errors = {};

    // Display name
    if (!userNickName.trim()) nextErrors.displayName = "닉네임을 입력해주세요.";

    // Sex
    if (!selectedGender) nextErrors.sex = "성별을 선택해주세요.";

    // Birth year
    if (userBirthYear == null) {
      nextErrors.birthYear = "출생연도를 입력해주세요.";
    } else {
      const yearNum = userBirthYear;
      const thisYear = new Date().getFullYear();

      // Check for exactly 4 digits
      if (yearNum < 1000 || yearNum > 9999) {
        nextErrors.birthYear = "출생연도는 4자리 숫자여야 합니다.";
      } 
      // Check for valid range
      else if (yearNum < 1900 || yearNum > thisYear) {
        nextErrors.birthYear = `유효한 출생연도를 입력해주세요. (1900 ~ ${thisYear})`;
      }
    }

    // MBTI 
    const mbtiValue = buildMbti(selectedMBTI);
    if (!mbtiValue) nextErrors.mbti = "MBTI 네 글자를 모두 선택해주세요.";

    // Job
    if (!selectedOccupation && !customOccupation.trim()) {
      nextErrors.job = "직업을 선택하거나 기타에 직접 입력해주세요.";
    }
    if (selectedOccupation === "기타" && !customOccupation.trim()) {
      nextErrors.customJob = "기타를 선택하셨습니다. 직업을 입력해주세요.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      const mbtiValue = buildMbti(selectedMBTI);

      const requestData = {
        displayName: userNickName.trim(),
        sex: selectedGender || null,
        birthYear: userBirthYear ? Number(userBirthYear) : null,
        mbti: mbtiValue,
        job: selectedOccupation || null,
        customJob: customOccupation.trim() || null,
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setModalOpen(true);
      } else {
        // If backend returns uniqueness error or anything else, surface it
        const err = (await response.json().catch(() => ({}))) as { error?: string };

        alert(err?.error || "저장 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading / auth gates
  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
          <p>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (!session?.user?.id) return null;

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
      <div className="max-w-2xl mx-auto">
        <PageHeader showBack={false} showDropdown={false} title="프로필" />
        <div className="flex flex-col gap-8 py-4">
          {/* Nickname */}
          <div className="w-full flex flex-col gap-2">
            <p className="block text-sm font-medium">닉네임</p>
            <input
              type="text"
              className={`px-3 py-1 h-12 rounded-md bg-main text-dark-950 focus:outline-none`}
              onChange={handleUserNickname}
              value={userNickName}
              placeholder="닉네임을 입력하세요"
              maxLength={15}
            />
            <div className="flex flex-row justify-between">
            <p className="text-sm text-red-500">{errors.displayName}</p>
            <p className="text-xs text-gray-500">{createdDate} 가입</p>
            </div>
          </div>

          {/* Gender */}
          <div>
            <p className="block text-sm font-medium mb-2">성별</p>
            <div className="flex flex-row gap-2">
              {["여자", "남자"].map((g) => (
                <input
                  key={g}
                  type="button"
                  className={`px-3 py-1 rounded-full focus:outline-none ${
                    selectedGender === g ? "bg-gray-600" : "bg-dark-900 text-gray-600"
                  }`}
                  value={g}
                  onClick={() => handleGenderSelect(g)}
                />
              ))}
            </div>
            {errors.sex && <p className="mt-1 text-sm text-red-500">{errors.sex}</p>}
          </div>

          {/* MBTI */}
          <div>
            <p className="block text-sm font-medium mb-2">MBTI</p>
            <div className="flex flex-row gap-3">
              {/* E/I */}
              <div className="flex flex-col gap-2">
                {(["E", "I"] as const).map((v) => (
                  <input
                    key={v}
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none ${
                      selectedMBTI.ei === v ? "bg-gray-600" : "bg-dark-900 text-gray-600"
                    }`}
                    value={`${v} ${v === "E" ? "외향" : "내향"}`}
                    onClick={() => handleMBTISelect("ei", v)}
                  />
                ))}
              </div>
              <div className="border border-gray-600" />
              {/* S/N */}
              <div className="flex flex-col gap-2">
                {(["S", "N"] as const).map((v) => (
                  <input
                    key={v}
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none ${
                      selectedMBTI.sn === v ? "bg-gray-600" : "bg-dark-900 text-gray-600"
                    }`}
                    value={`${v} ${v === "S" ? "감각" : "직관"}`}
                    onClick={() => handleMBTISelect("sn", v)}
                  />
                ))}
              </div>
              <div className="border border-gray-600" />
              {/* T/F */}
              <div className="flex flex-col gap-2">
                {(["T", "F"] as const).map((v) => (
                  <input
                    key={v}
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none ${
                      selectedMBTI.tf === v ? "bg-gray-600" : "bg-dark-900 text-gray-600"
                    }`}
                    value={`${v} ${v === "T" ? "사고" : "감정"}`}
                    onClick={() => handleMBTISelect("tf", v)}
                  />
                ))}
              </div>
              <div className="border border-gray-600" />
              {/* J/P */}
              <div className="flex flex-col gap-2">
                {(["J", "P"] as const).map((v) => (
                  <input
                    key={v}
                    type="button"
                    className={`px-3 py-1 rounded-full focus:outline-none ${
                      selectedMBTI.jp === v ? "bg-gray-600" : "bg-dark-900 text-gray-600"
                    }`}
                    value={`${v} ${v === "J" ? "판단" : "인식"}`}
                    onClick={() => handleMBTISelect("jp", v)}
                  />
                ))}
              </div>
            </div>
            {errors.mbti && <p className="mt-1 text-sm text-red-500">{errors.mbti}</p>}
          </div>

          {/* Birth Year */}
          <div>
            <p className="block text-sm font-medium mb-2">출생연도</p>
            <div className="w-32 relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                className={`w-full px-3 py-1 rounded-full bg-dark-900 focus:outline-none focus:ring-1 ${
                  errors.birthYear ? "focus:ring-red-500" : "focus:ring-main"
                } focus:text-main focus:bg-dark-950 no-spinner`}
                name="출생연도"
                value={userBirthYear}
                onChange={handleUserBirthYear}
              />
              <p className="absolute right-3 bottom-1">년</p>
            </div>
            {errors.birthYear && <p className="mt-1 text-sm text-red-500">{errors.birthYear}</p>}
          </div>

          {/* Occupation */}
          <div className="flex flex-col gap-3 items-start">
            <p className="block text-sm font-medium mb-2">직업</p>
            <div className="flex flex-row gap-2 flex-wrap">
              {["중고등학생", "대학/대학원생", "취준생", "직장인", "자영업", "전문직", "기타"].map((job) => (
                <input
                  key={job}
                  type="button"
                  className={`px-3 py-1 rounded-full focus:outline-none ${
                    selectedOccupation === job ? "bg-gray-600" : "bg-dark-900 text-gray-600"
                  }`}
                  value={job}
                  onClick={() => handleJobClick(job)}
                />
              ))}
            </div>

            <input
              type="text"
              className={`px-3 py-1 focus:outline-none rounded-full bg-dark-900 focus:ring-1 ${
                errors.customJob ? "focus:ring-red-500" : "focus:ring-main"
              } focus:text-main focus:bg-dark-950 mr-2`}
              placeholder="기타: 직접입력(10자이내)"
              value={customOccupation}
              maxLength={10}
              onChange={handleCustomJob}
            />
            {errors.job && <p className="mt-1 text-sm text-red-500">{errors.job}</p>}
            {errors.customJob && <p className="mt-1 text-sm text-red-500">{errors.customJob}</p>}
          </div>

          {/* Actions */}
          <div className="w-full flex flex-row gap-2">
            <Button
              text="로그아웃"
              beforeIcon={<BoxArrowRight />}
              variant="secondary"
              onClick={async () => {
                await signOut({ callbackUrl: "/login", redirect: true });
              }}
              isLink={false}
            />
            <Button
              text={"저장하기"}
              beforeIcon={<Download />}
              onClick={handleSave}
              variant="primary"
              isLink={false}
              disabled={isSaving}
              isLoading={isSaving}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        icon={<CheckCircle size={62} color="#B19DFF" />}
        primaryText="확인"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title=""
        message="저장되었습니다."
      />
    </main>
  );
}
