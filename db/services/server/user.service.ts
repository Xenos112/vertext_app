import UserRepository from "@/db/repositories/user.repository";
import tryCatch from "@/utils/tryCatch";
import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import generateToken from "@/utils/generate-token";
import { cookies } from "next/headers";
import validateAuth from "@/utils/validateAuth";

async function getUser(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const { data: user, error } = await tryCatch(UserRepository.getUserById(id));
  if (!id)
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  if (error)
    return NextResponse.json(
      { error: "Failed to fetch the user" },
      { status: 400 },
    );
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  return NextResponse.json({ user });
}

// FIX: need validation
async function register(req: NextRequest) {
  const cookieStore = await cookies();
  const userData = (await req.json()) as Prisma.UserCreateInput & {
    email: string;
  };
  const { data: oldUser, error: oldUserError } = await tryCatch(
    UserRepository.getUserByEmail(userData.email),
  );

  if (oldUser)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  if (oldUserError)
    return NextResponse.json(
      { error: "Failed to Validate Email" },
      { status: 400 },
    );

  const hashedPassword = await bcrypt.hash(userData.password as string, 10);
  userData.password = hashedPassword;
  const { data: newUser, error } = await tryCatch(
    UserRepository.createUser(userData),
  );
  if (error || !newUser)
    return NextResponse.json(
      { error: "Failed to create the user" },
      { status: 400 },
    );

  const token = generateToken(newUser.id as string);
  cookieStore.set("auth_token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ user: newUser });
}

async function login(req: NextRequest) {
  const cookieStore = await cookies();
  const userData = (await req.json()) as {
    email: string;
    password: string;
  };

  const { data: user, error: userFetchError } = await tryCatch(
    UserRepository.getUserByEmail(userData.email, false),
  );

  if (userFetchError)
    return NextResponse.json(
      { error: "Failed to fetch the user" },
      { status: 400 },
    );
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  const { data: passwordMatch, error: passwordCompareError } = await tryCatch(
    bcrypt.compare(userData.password, user.password as string),
  );
  if (passwordCompareError)
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  if (!passwordMatch)
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const token = generateToken(user.id as string);

  console.log(token);
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return NextResponse.json({
    token,
    user,
  });
}

async function deleteUser(
  _req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id)
    return NextResponse.json({ error: "User id is required" }, { status: 400 });

  const { data: deletedUser, error } = await tryCatch(
    UserRepository.deleteUser(id),
  );
  if (error || !deletedUser)
    return NextResponse.json(
      { error: "Failed to delete the user" },
      { status: 400 },
    );

  return NextResponse.json({ user: deletedUser });
}

async function updateUser(
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  if (!id)
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  const userData = (await req.json()) as Prisma.UserUpdateInput;
  const { data: updatedUser, error } = await tryCatch(
    UserRepository.updateUser(userData.id as string, userData),
  );
  if (error || !updatedUser)
    return NextResponse.json(
      { error: "Failed to update the user" },
      { status: 400 },
    );

  return NextResponse.json({ user: updatedUser });
}

async function getMe(_req: NextRequest) {
  const { data: authedUser, error: authedUserError } =
    await tryCatch(validateAuth());
  if (authedUserError) return NextResponse.json({ me: null });

  return NextResponse.json({ me: authedUser });
}

const UserService = {
  getUser,
  register,
  deleteUser,
  updateUser,
  login,
  getMe,
};

export default UserService;
