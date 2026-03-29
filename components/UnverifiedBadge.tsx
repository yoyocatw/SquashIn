import { Badge } from "@/components/ui/badge"
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from '@/components/ui/tooltip'
import { BadgeX } from "lucide-react"
import Link from 'next/link'


export default function UnVerifiedBadge() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="destructive" className="cursor-pointer gap-1">
                        <BadgeX className="size-3" />
                        Unverified
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-55 text-center">
                    <p className="text-xs">
                        This court is not verified yet. You can help by following this court if you've played there!{' '}
                        <Link href="/how-verification-works" className="underline font-medium">
                            Learn more
                        </Link>
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};