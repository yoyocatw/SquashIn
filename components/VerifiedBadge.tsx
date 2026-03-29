import { Badge } from "@/components/ui/badge"
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from '@/components/ui/tooltip'
import { BadgeCheck } from "lucide-react"
import Link from 'next/link'


export default function VerifiedBadge() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="success" className="cursor-pointer gap-1">
                        <BadgeCheck className="size-3" />
                        Verified
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-55 text-center">
                    <p className="text-xs">
                        This court has been saved by 3+ players.{' '}
                        <Link href="/how-verification-works" className="underline font-medium">
                            Learn more
                        </Link>
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};