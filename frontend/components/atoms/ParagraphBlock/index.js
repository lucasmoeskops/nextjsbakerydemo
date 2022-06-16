import {richTextToReact} from "../../../wagtail/utils/richtext";

export default function ParagraphBlock({data}) {
  return richTextToReact(data)
}
