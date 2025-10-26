import { Trans } from "@lingui/react/macro"
import Link from "next/link"

export default function TermsAndConditions() {
	return (
		<p>
			<Trans>
				By continuing, you accept our{" "}
				<Link
					href="/terms"
					className="text-blue-600 hover:text-blue-800"
				>
					Terms of service
				</Link>{" "}
				and{" "}
				<Link
					href="/privacy"
					className="text-blue-600 hover:text-blue-800"
				>
					Privacy Policy
				</Link>
			</Trans>
		</p>
	)
}
