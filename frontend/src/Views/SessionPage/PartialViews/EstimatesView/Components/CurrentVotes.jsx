import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import InfoRow from "../../../../../Components/Typograpghy/InfoRow";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import TimeCounter from "./TimeCounter";
import { createSelector } from "reselect";
import { useSnackbar } from "notistack";

const CurrentVotes = ({
  title = "Last round:",
  startTime = new Date(),
  endTime = new Date(),
  max = "--",
  min = "--",
  onClick,
}) => {
  const [currentMax, setCurrentMax] = useState(max);
  const [currentMin, setCurrentMin] = useState(min);
  const { enqueueSnackbar } = useSnackbar();

  const selectVotesAndMembers = createSelector(
    (state) => state.story.votes,
    (state) => state.member.members,
    (state) => state.story.votesRevealed,
    (votes, members, votesRevealed) => ({ votes, members, votesRevealed })
  );

  const { votes, members, votesRevealed } = useSelector(selectVotesAndMembers);
  const isScrumMaster = useSelector((state) => state.session.isScrumMaster);
  const allVoted = votes?.length === members?.length - 1;

  const handleRevealVotes = () => {
    if (members.length === 0) {
      enqueueSnackbar("No members have joined yet.", { variant: "warning" });
      return;
    }

    onClick();
    if (members.length === 1) {
      enqueueSnackbar("There is only one member.", { variant: "info" });
      if (votes?.length === 1) {
        const singleVote = votes[0]?.estimation;
        setCurrentMax(singleVote);
        setCurrentMin(singleVote);
      }
      return;
    }

    if (votes?.length > 0) {
      enqueueSnackbar("Votes revealed successfully!", { variant: "success" });
    } else {
      enqueueSnackbar("No estimates have been added yet.", { variant: "info" });
    }
  };

  useEffect(() => {
    if (votes?.length > 0 && votesRevealed) {
      const estimations = votes.map((vote) => vote.estimation);
      setCurrentMax(Math.max(...estimations));
      setCurrentMin(Math.min(...estimations));
    } else {
      setCurrentMax("--");
      setCurrentMin("--");
    }
  }, [votes, votesRevealed]);

  return (
    <Box>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h6">{title}</Typography>
        {onClick && isScrumMaster && (
          <Button
            size="small"
            variant={allVoted ? "contained" : "outlined"}
            color={allVoted ? "success" : "primary.light"}
            onClick={allVoted ? handleRevealVotes : undefined}
            disabled={!allVoted || votesRevealed}
          >
            Reveal Votes
          </Button>
        )}
      </Stack>
      <Stack mt={1}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="caption">{"Time"}</Typography>
          <TimeCounter
            startDate={startTime}
            endDate={endTime}
            isRunning={true}
          />
        </Stack>
        <InfoRow
          color={Number(currentMax) > 0 ? "success" : undefined}
          title="Max"
          value={currentMax?.toString()}
        />
        <InfoRow
          color={Number(currentMax) > 0 ? "error" : undefined}
          title="Min"
          value={currentMin?.toString()}
        />
      </Stack>
    </Box>
  );
};

CurrentVotes.prototypes = {
  title: PropTypes.string,
  startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
  max: PropTypes.string,
  min: PropTypes.string,
  onClick: PropTypes.func,
};

export default CurrentVotes;
