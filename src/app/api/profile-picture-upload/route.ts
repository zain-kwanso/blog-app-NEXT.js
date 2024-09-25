import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3, generatePresignedUrl } from "@/services/s3Service";
import User from "@/database/models/user.model";
import { getUserAction } from "@/app/actions/auth";

export async function POST(req: NextRequest) {
  const sessionUser = await getUserAction();

  if (!sessionUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;
    const fileName = formData.get("fileName") as string;
    const fileType = formData.get("fileType") as string;

    if (!file || !fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing file or file metadata" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const profileKey = await uploadFileToS3(
      sessionUser?.id!,
      fileName,
      buffer,
      fileType
    );

    await User.update({ profileKey }, { where: { id: sessionUser?.id } });

    const fileUrl = await generatePresignedUrl(profileKey);

    return NextResponse.json(
      {
        message: "Profile picture uploaded and profile updated successfully",
        fileUrl,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
