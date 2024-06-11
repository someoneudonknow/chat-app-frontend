import {
  Avatar,
  Box,
  Paper,
  PaperProps,
  Stack,
  Typography,
} from "@mui/material";
import User from "../../models/user.model";
import unknownFlag from "../../assets/images/icon/flag_icon.png";
import Industry from "../../models/industry.model";

type UserContactItemPropsType = {
  data: User;
  active?: boolean;
  onItemClick?: (user: User) => void;
} & PaperProps;

const UserContactItem: React.FC<UserContactItemPropsType> = ({
  data,
  active,
  onItemClick,
  ...rest
}) => {
  return (
    <Paper
      sx={{
        width: "100%",
        p: 2,
        display: "grid",
        gridTemplateColumns: "80px 2fr 1fr",
        mb: 1,
        alignItems: "center",
        transition: "all linear .1s",
        bgcolor: (theme) =>
          active
            ? theme.palette.containerSecondary?.main
            : theme.palette.background.paper,
        "&:hover": {
          bgcolor: (theme) =>
            active
              ? theme.palette.containerSecondary?.main
              : `${theme.palette.containerSecondary?.main}60`,
        },
      }}
      onClick={() => onItemClick && onItemClick(data)}
      {...rest}
    >
      <Avatar src={data?.photo} sx={{ width: `70px`, height: `70px` }} />
      <Stack ml={2} direction="column" sx={{ textAlign: "left" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography variant="h5">{data?.userName || data?.email}</Typography>
          <img
            style={{ marginLeft: "10px" }}
            loading="lazy"
            width="26"
            srcSet={
              data?.country?.countryCode
                ? `https://flagcdn.com/w40/${data.country?.countryCode.toLowerCase()}.png 2x`
                : unknownFlag
            }
            src={
              data?.country?.countryCode
                ? `https://flagcdn.com/w20/${data.country?.countryCode.toLowerCase()}.png`
                : unknownFlag
            }
            alt="user-country"
          />
        </Box>
        <Typography variant="body1">
          {(data?.industry as Industry)?.name}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default UserContactItem;
