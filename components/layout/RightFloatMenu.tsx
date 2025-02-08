'use client'
import { getRecommendedUsers } from '@/actions/user.actions'
import { useToast } from '@/hooks/use-toast'
import React from 'react'
import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { formatUserNameForImage } from '@/utils/format-user_name-for-image'
import { Button } from '../ui/button'

type SuggestedUsersType = Awaited<ReturnType<typeof getRecommendedUsers>>['users']

// TODO: make the follow button work
export default function RightFloatMenu() {
  const [users, setUsers] = useState<SuggestedUsersType>()
  const { toast } = useToast()

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
        toast({
          variant: "destructive",
          title: 'Error',
          description: data.error as string
        })
      }
    })
  }, [])

  return (
    <div className='space-y-5 absolute top-12 right-12'>
      <h1 className='text-xl font-semibold'>Who To Follow</h1>
      <div className='w-72 space-y-4'>
        {users?.map(user => (
          <div key={user.id} className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar className='size-[30px]'>
                <AvatarImage src={user.image_url!} />
                <AvatarFallback className='text-xs'>{formatUserNameForImage(user.user_name)}</AvatarFallback>
              </Avatar>
              <p>{user.user_name}</p>
            </div>
            <Button size='sm'>Follow</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
