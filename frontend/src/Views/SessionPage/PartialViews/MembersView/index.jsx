import React from "react";
import FrameComponent from "../../../../Components/Frames/FrameComponent";
import { Stack } from "@mui/material";
import MemberComponent from "./Components/MemberComponent";
import { useSelector } from "react-redux";
import { STATUS } from "../../../../Common/Vars/Constants";
import LoaderComp from "../../../../Components/Extras/LoaderComp";
import { getTokenData } from "../../../../Common/Utils/tokenUtils";

const MembersView = () => {
  const { members, status } = useSelector((state) => state.member);
  const votes = useSelector((state) => state.story.votes);
  const votesRevealed = useSelector((state) => state.story.votesRevealed);
  const tokenData = getTokenData();
  const currentMemberId = tokenData?.memberId;

  const adjustedMembers = members
    .map((member) => ({
      ...member,
      isCurrent: member.id === currentMemberId,
    }))
    .sort((a, b) => b.isCurrent - a.isCurrent);

  return (
    <FrameComponent
      paperSx={{
        flex: 1,
      }}
      title={`Members ${members?.length}`}
    >
      {status === STATUS.LOADING ? (
        <LoaderComp />
      ) : (
        <Stack spacing={1.5}>
          {adjustedMembers.map((item, index) => (
            <MemberComponent
              noVote={item?.role === "Scrum Master"}
              key={index + item?.name}
              name={item.isCurrent ? item?.name + " ⭐" : item?.name}
              role={item?.role}
              revealed={votesRevealed}
              vote={
                votes?.find((vote) => vote?.memberId === item?.id)
                  ?.estimation || 0
              }
              avatarIndex={item?.avatarIndex}
              voted={
                votes?.find((vote) => vote?.memberId === item?.id)?.estimation
              }
            />
          ))}
        </Stack>
      )}
    </FrameComponent>
  );
};

export default MembersView;
