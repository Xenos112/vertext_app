'use client'
import { followUser, getRecommendedCommunities, getRecommendedUsers } from '@/actions/user.actions'
import { useToast } from '@/hooks/use-toast'
import React, { useTransition } from 'react'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatUserNameForImage } from '@/utils/format-user_name-for-image'
import { Button } from '../ui/button'
import { FiLoader } from 'react-icons/fi'
import { joinCommunity } from '@/actions/community.actions'

type SuggestedUsersType = Awaited<ReturnType<typeof getRecommendedUsers>>['users']
type SuggestedCommunitiesType = Awaited<ReturnType<typeof getRecommendedCommunities>>['communities']

// TODO: make the follow button work
export default function RightFloatMenu() {
  const [users, setUsers] = useState<SuggestedUsersType>()
  const [communities, setCommunities] = useState<SuggestedCommunitiesType>([])
  const { toast } = useToast()
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    getRecommendedUsers().then(data => {
      if (data.error) {
        toast({
          variant: "destructive",
          title: 'Error',
          description: data.error as string
        })
      } else {
        setUsers(data.users)
      }
    })
  }, [])

  useEffect(() => {
    getRecommendedCommunities().then(data => {
      if (data.error) {
        toast({
          variant: "destructive",
          title: 'Error',
          description: data.error as string
        })
      } else {
        setCommunities(data.communities)
      }
    })
  }, [])

  const handleFollowClick = async (userId: string) => {
    startTransition(async () => {
      const data = await followUser(userId)
      if (data.error) {
        toast({
          variant: "destructive",
          title: 'Error',
          description: data.error as string
        })
      } else {
        const poppedUser = users?.filter(u => u.id !== userId);
        if (!poppedUser || poppedUser.length === users?.length) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: "User not found or already removed",
          });
          return;
        }
        setUsers(poppedUser);
        toast({
          title: 'Success',
          description: `You have followed ${poppedUser[0].user_name}`,
        });
      }
    })
  }

  const handleJoinClick = async (communityId: string) => {
    startTransition(async () => {
      const data = await joinCommunity(communityId)
      if (data.error) {
        toast({
          variant: "destructive",
          title: 'Error',
          description: data.error as string
        })
      } else {
        const poppedUser = communities?.filter(u => u.id !== communityId);
        if (!poppedUser || poppedUser.length === users?.length) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: "Community not found or already removed",
          });
          return;
        }
        setCommunities(poppedUser);
        toast({
          title: 'Success',
          description: `You have Joined ${poppedUser[0].name}`,
        });
      }
    })
  }

  return (
    <div className='absolute top-12 right-12 space-y-6'>
      {users && users?.length > 0 && (
        <div className='space-y-5'>
          <h1 className='text-xl font-semibold'>Who To Follow</h1>
          <div className='w-72 space-y-4'>
            {users.map(user => (
              <div key={user.id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-[30px]'>
                    <AvatarImage src={user.image_url!} />
                    <AvatarFallback className='text-xs'>{formatUserNameForImage(user.user_name)}</AvatarFallback>
                  </Avatar>
                  <p>{user.user_name}</p>
                </div>
                <Button onClick={() => handleFollowClick(user.id)} disabled={loading} size='sm'>{loading && <FiLoader />} Follow</Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {communities && communities.length > 0 && (
        <div className='space-y-5'>
          <h1 className='text-xl font-semibold'>Communities to Join</h1>
          <div className='w-72 space-y-4'>
            {communities.map(community => (
              <div key={community.id} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-[30px]'>
                    <AvatarImage src={community.image!} />
                    <AvatarFallback className='text-xs'>{formatUserNameForImage(community.name)}</AvatarFallback>
                  </Avatar>
                  <p>{community.name}</p>
                </div>
                <Button onClick={() => handleFollowClick(community.id)} disabled={loading} size='sm'>{loading && <FiLoader />} Join</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
