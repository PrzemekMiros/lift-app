import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fonts } from '../../constants/theme';

const styles = StyleSheet.create({
  workoutInner: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 12,
  },
  workoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  finishBtn: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  finishBtnText: {
    color: colors.accent,
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  backButtonContainer: {
    marginTop: 6,
    marginBottom: 8,
    paddingVertical: 8,
  },
  backLink: {
    color: colors.accent,
    fontWeight: '500',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#3a3450',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a445f',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardDuration: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  cardSub: {
    color: colors.muted,
    fontSize: 11,
  },
  cardArrow: {
    color: colors.accent,
  },
  listContent: {
    paddingBottom: 120,
  },
  bottomAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
  },
  bottomButton: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  bottomButtonText: {
    color: colors.accent,
    fontWeight: '500',
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  outlineBtn: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.accent,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#3a3450',
    color: colors.text,
    padding: 12,
    borderRadius: 12,
  },
  inputSmall: {
    backgroundColor: '#3a3450',
    color: colors.text,
    padding: 12,
    borderRadius: 12,
    width: 75,
    marginRight: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  addBtnText: {
    fontWeight: '500',
    color: colors.accent,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#3a3450',
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a445f',
  },
  setText: {
    color: colors.muted,
    fontWeight: '500',
  },
  setVal: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 16,
  },
  removeText: {
    color: colors.error,
    fontSize: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  modalRow: {
    paddingHorizontal: 20,
  },
  modalInput: {
    flex: 1,
  },
  dbList: {
    paddingHorizontal: 20,
  },
  dbItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#4a445f',
  },
  dbItemText: {
    color: colors.text,
    fontSize: 16,
  },
  addSmall: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  addSmallText: {
    fontWeight: '500',
    color: colors.accent,
    fontSize: 18,
  },
  closeBtn: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  closeBtnText: {
    color: colors.accent,
    fontWeight: '500',
  },
});

export default styles;
