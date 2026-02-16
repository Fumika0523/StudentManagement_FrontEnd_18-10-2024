import { Box, Paper, Typography, Divider, Stack } from "@mui/material";
import { Button } from "react-bootstrap";
import ProfileRow from "../Edit/ProfileRow";
import ProfileCard from "../Edit/ProfileCard";

export default function ProfileSections({
    navigate,
    loading,
    username,
    email,
    phoneNumber,
    gender,
    role,
    birthdateFormatted,
    initials,
    setOpenBirthModal,
    setOpenPhoneModal,
    icons
}) {
    const {
        PersonIcon,
        CakeIcon,
        EmailIcon,
        PhoneIcon,
        WcIcon,
        LockIcon,
        PhotoCameraIcon
    } = icons;

    return (
        <Box sx={{ maxWidth: 980, mx: "auto" }}>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "stretch", md: "flex-start" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 28,
                            fontWeight: 800,
                            color: "#1f2430",
                            lineHeight: 1.2,
                        }}
                    >
                        Personal info
                    </Typography>

                    <Typography
                        sx={{ fontSize: 14, color: "#6b7280", mt: 0.75 }}
                    >
                        Manage your profile details across Student Management Service
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        border: "1px solid #e9eaf0",
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        boxShadow: "0 6px 18px rgba(17, 24, 39, 0.06)",
                        width: { xs: "100%", md: "auto" },
                    }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "999px",
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: "#1f2a90",
                            color: "white",
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#111827",
                                lineHeight: 1.2,
                            }}
                        >
                            {loading ? "Loading..." : username}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: "#6b7280",
                                mt: 0.25,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: { xs: "100%", md: 260 },
                            }}
                        >
                            {loading ? "" : email}
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* GRID */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>

                <ProfileCard title="Basic info" hint="Some info may be visible to other users.">

                    <ProfileRow
                        label="Profile picture"
                        icon={<PhotoCameraIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                        value="Add a profile picture to personalize your account"
                    />

                    <Divider />

                    <ProfileRow
                        label="Username"
                        icon={<PersonIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                        value={username}
                        onClick={() => navigate("/usernameform")}
                    />

                    <Divider />

                    <ProfileRow
                        label="Birthday"
                        icon={<CakeIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                        value={birthdateFormatted}
                        onClick={() => setOpenBirthModal(true)}
                    />
                    <Divider />

                    <ProfileRow
                        label="Gender"
                        icon={<WcIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                        value={gender?.charAt(0).toUpperCase() + gender?.slice(1)}
                        onClick={() => navigate("/genderform")}
                    />
                           <Divider />

                    <ProfileRow
                        label="Role"
                        icon={<WcIcon sx={{ fontSize: 18, color: "#9aa3b2" }}/>}
                          value={role?.charAt(0).toUpperCase() + role?.slice(1)}
                    />
                </ProfileCard>

                <ProfileCard title="Contact info" hint="How we can reach you.">

                    <ProfileRow
                        label="Email"
                        icon={<EmailIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                        value={email}
                    />

                    <Divider />

                    <ProfileRow
                        label="Phone"
                        icon={<PhoneIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                        value={phoneNumber}
                        onClick={() => setOpenPhoneModal(true)}
                    />

                </ProfileCard>

                <Box sx={{ gridColumn: { md: "1 / -1" } }}>
                    <ProfileCard title="Security" hint="Protect your account.">
                        <ProfileRow
                            label="Password"
                            icon={<LockIcon sx={{ fontSize: 18, color: "#9aa3b2" }} />}
                            value="A secure password helps protect your account"
                            onClick={() => navigate("/passwordform")}
                        />
                    </ProfileCard>
                </Box>
            </Box>
            <Stack direction="row" className="mt-3">
                <Button onClick={() => navigate("/dashboard")}>Back</Button>
            </Stack>
        </Box>
    );
}


// Icon should show the profile photo, other wise just initial.
// changing password function
//User