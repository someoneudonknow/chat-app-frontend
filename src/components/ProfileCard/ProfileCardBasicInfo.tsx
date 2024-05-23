import React from "react";
import User from "../../models/user.model";
import { Tooltip, Typography } from "@mui/material";
import { calculateAge, getGender } from "../../utils";
import Industry from "../../models/industry.model";
import { Gender } from "../../constants/types";
import { TextOverflowEllipsis } from "../Person/PersonItem";

type ProfileCardBasicInfoPropsType = {
  user: Partial<User>;
};

const ProfileCardBasicInfo: React.FC<ProfileCardBasicInfoPropsType> = ({
  user,
}) => {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <Tooltip title={user?.userName || user.email}>
          <TextOverflowEllipsis
            sx={{
              maxWidth: "18ch",
            }}
            fontSize={"30px"}
          >
            {user?.userName || user.email}
          </TextOverflowEllipsis>
        </Tooltip>
        <Typography sx={{ ml: 1, fontSize: "17px" }}>
          ({getGender(user?.gender as Gender)})
        </Typography>
        <img
          style={{ marginLeft: "10px" }}
          loading="lazy"
          width="26"
          srcSet={`https://flagcdn.com/w40/${user.country?.countryCode.toLowerCase()}.png 2x`}
          src={`https://flagcdn.com/w20/${user.country?.countryCode.toLowerCase()}.png`}
          alt=""
        />
      </div>
      <Typography sx={{ mt: 2, fontSize: "15px" }} variant="body2">
        {user?.birthday && calculateAge(user.birthday)}
        {user?.industry && " | " + (user.industry as Industry).name}
      </Typography>
    </>
  );
};

export default ProfileCardBasicInfo;
