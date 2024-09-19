import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { uploadFileToS3, generatePresignedUrl } from "@/services/s3Service";
import User from "@/database/models/user.model";

export async function POST(req: NextRequest) {
  const tokenVerification = await verifyToken(req);

  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 403 }
    );
  }

  const { user } = tokenVerification;

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
      user?.id!,
      fileName,
      buffer,
      fileType
    );

    await User.update({ profileKey }, { where: { id: user.id } });

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
