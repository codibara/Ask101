import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/tables";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, sex, birthYear, mbti, job, customJob } = body;

    console.log("Received data:", {
      displayName,
      sex,
      birthYear,
      mbti,
      job,
      customJob,
    }); // Debug log

    // Validate required displayName
    if (!displayName || displayName.trim() === "") {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    // Handle MBTI value (now comes as combined string from frontend)
    let mbtiValue = null;
    if (mbti && typeof mbti === "string" && mbti.length === 4) {
      // Validate that it's a valid MBTI type
      const validMbtiTypes = [
        "INTJ",
        "INTP",
        "ENTJ",
        "ENTP",
        "INFJ",
        "INFP",
        "ENFJ",
        "ENFP",
        "ISTJ",
        "ISFJ",
        "ESTJ",
        "ESFJ",
        "ISTP",
        "ISFP",
        "ESTP",
        "ESFP",
      ];
      if (validMbtiTypes.includes(mbti)) {
        mbtiValue = mbti;
      }
    }

    // Update user profile
    const updateData: any = {
      displayName: displayName.trim(),
      onboardingCompleted: true,
    };

    // Handle sex field - convert Korean to English if needed
    if (sex) {
      if (sex === "남자") {
        updateData.sex = "male";
      } else if (sex === "여자") {
        updateData.sex = "female";
      } else {
        updateData.sex = sex;
      }
    }
    if (birthYear) updateData.birthYear = parseInt(birthYear);
    if (mbtiValue) updateData.mbti = mbtiValue;

    // Handle job and custom job
    if (job && job !== "기타") {
      updateData.job = job;
      updateData.customJob = null; // Clear custom job if not "기타"
    } else if (job === "기타" && customJob) {
      updateData.job = "기타";
      updateData.customJob = customJob.trim();
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(session.user.id)));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user profile data
    const userResult = await db
      .select({
        displayName: users.displayName,
        sex: users.sex,
        birthYear: users.birthYear,
        mbti: users.mbti,
        job: users.job,
        customJob: users.customJob,
        onboardingCompleted: users.onboardingCompleted,
      })
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userResult[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
